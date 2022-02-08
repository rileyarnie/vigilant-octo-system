export default class FeeItem {
    constructor(
		public id: number,
		public narrative: string,
		public amount: number,
		public currency: string
    ) {}
}