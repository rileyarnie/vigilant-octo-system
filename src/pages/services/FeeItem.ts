export default class FeeItem {
	constructor(
		public id: number,
		public narrative: string,
		public amount: string,
		public currency: string
	) {}
}