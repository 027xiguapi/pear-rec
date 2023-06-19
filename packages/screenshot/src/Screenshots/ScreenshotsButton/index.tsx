import React, {
	memo,
	ReactElement,
	PointerEvent,
	ReactNode,
	useCallback,
} from "react";
import ScreenshotsOption from "../ScreenshotsOption";
import "./index.scss";

export interface ScreenshotsButtonProps {
	title: string;
	icon: string;
	checked?: boolean;
	disabled?: boolean;
	option?: ReactNode;
	onClick?: (e: PointerEvent<HTMLDivElement>) => unknown;
}

export default memo(function ScreenshotsButton({
	title,
	icon,
	checked,
	disabled,
	option,
	onClick,
}: ScreenshotsButtonProps): ReactElement {
	const classNames = ["screenshots-button"];

	const onButtonClick = useCallback(
		(e: PointerEvent<HTMLDivElement>) => {
			if (disabled || !onClick) {
				return;
			}
			onClick(e);
		},
		[disabled, onClick],
	);

	if (checked) {
		classNames.push("screenshots-button-checked");
	}
	if (disabled) {
		classNames.push("screenshots-button-disabled");
	}

	return (
		<ScreenshotsOption open={checked} content={option}>
			<div
				className={classNames.join(" ")}
				title={title}
				onClick={onButtonClick}
			>
				<span className={icon} />
			</div>
		</ScreenshotsOption>
	);
});
