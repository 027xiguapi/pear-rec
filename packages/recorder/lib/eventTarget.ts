type EventType =
	| "error"
	| "create"
	| "destroy"
	| "start"
	| "stop"
	| "pause"
	| "resume"
	| "dataavailable";

class EventTarget {
	private eventBus: Record<EventType, Function[]> = {
		error: [],
		create: [],
		destroy: [],
		start: [],
		stop: [],
		pause: [],
		resume: [],
		dataavailable: [],
	};

	// 注册
	on(name: EventType, callback: Function) {
		const callbackList: Array<Function> = this.eventBus[name] || [];
		callbackList.push(callback);
		this.eventBus[name] = callbackList;
	}

	// 触发
	emit(name: EventType, ...args: Array<any>) {
		const evnetName = this.eventBus[name];
		if (evnetName) {
			evnetName.forEach((fn) => {
				fn.apply(this, args);
			});
		} else {
			console.error(`emit ${name} is not find`);
		}
	}

	// 删除
	off(name: EventType, fn: Function) {
		const evnetName = this.eventBus[name];
		if (evnetName && fn) {
			const index = evnetName.findIndex((fns) => fns === fn);
			evnetName.splice(index, 1);
		} else {
			console.error(`off ${name} is not find`);
		}
	}

	// 注册一次
	once(name: EventType, fn: Function) {
		const decor = (...args: Array<any>) => {
			fn.apply(this, args);
			this.off(name, decor);
		};
		this.on(name, decor);
	}
}

export default EventTarget;
