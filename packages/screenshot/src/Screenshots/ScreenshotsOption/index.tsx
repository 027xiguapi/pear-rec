import React, {
	cloneElement,
	memo,
	ReactElement,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { ScreenshotsOperationsCtx } from "../ScreenshotsOperations";
import { Point } from "../types";
import "./index.scss";

export interface ScreenshotsOptionProps {
	open?: boolean;
	content?: ReactNode;
	children: ReactElement;
}

export type Position = Point;

export enum Placement {
	Bottom = "bottom",
	Top = "top",
}

export default memo(function ScreenshotsOption({
	open,
	content,
	children,
}: ScreenshotsOptionProps): ReactElement {
	const childrenRef = useRef<HTMLDivElement>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const operationsRect = useContext(ScreenshotsOperationsCtx);
	const [placement, setPlacement] = useState<Placement>(Placement.Bottom);
	const [position, setPosition] = useState<Position | null>(null);
	const [offsetX, setOffsetX] = useState<number>(0);

	const getPopoverEl = () => {
		if (!popoverRef.current) {
			popoverRef.current = document.createElement("div");
		}
		return popoverRef.current;
	};

	useEffect(() => {
		const $el = getPopoverEl();
		if (open) {
			document.body.appendChild($el);
		}
		return () => {
			$el.remove();
		};
	}, [open]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (
			!open ||
			!operationsRect ||
			!childrenRef.current ||
			!contentRef.current
		) {
			return;
		}

		const childrenRect = childrenRef.current.getBoundingClientRect();
		const contentRect = contentRef.current.getBoundingClientRect();

		let currentPlacement = placement;
		let x = childrenRect.left + childrenRect.width / 2;
		let y = childrenRect.top + childrenRect.height;
		let currentOffsetX = offsetX;

		// 如果左右都越界了，就以左边界为准
		if (x + contentRect.width / 2 > operationsRect.x + operationsRect.width) {
			const ox = x;
			x = operationsRect.x + operationsRect.width - contentRect.width / 2;
			currentOffsetX = ox - x;
		}

		// 左边不能超出
		if (x < operationsRect.x + contentRect.width / 2) {
			const ox = x;
			x = operationsRect.x + contentRect.width / 2;
			currentOffsetX = ox - x;
		}

		// 如果上下都越界了，就以上边界为准
		if (y > window.innerHeight - contentRect.height) {
			if (currentPlacement === Placement.Bottom) {
				currentPlacement = Placement.Top;
			}
			y = childrenRect.top - contentRect.height;
		}

		if (y < 0) {
			if (currentPlacement === Placement.Top) {
				currentPlacement = Placement.Bottom;
			}
			y = childrenRect.top + childrenRect.height;
		}
		if (currentPlacement !== placement) {
			setPlacement(currentPlacement);
		}
		if (position?.x !== x || position.y !== y) {
			setPosition({
				x,
				y,
			});
		}

		if (currentOffsetX !== offsetX) {
			setOffsetX(currentOffsetX);
		}
	});

	return (
		<>
			{cloneElement(children, {
				ref: childrenRef,
			})}
			{open &&
				content &&
				createPortal(
					<div
						ref={contentRef}
						className="screenshots-option"
						style={{
							visibility: position ? "visible" : "hidden",
							transform: `translate(${position?.x ?? 0}px, ${
								position?.y ?? 0
							}px)`,
						}}
						data-placement={placement}
					>
						<div className="screenshots-option-container">{content}</div>
						<div
							className="screenshots-option-arrow"
							style={{ marginLeft: offsetX }}
						/>
					</div>,
					getPopoverEl(),
				)}
		</>
	);
});
