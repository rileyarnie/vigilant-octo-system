export default class FeePaymentRecord {
    constructor (
		public studentId: number,
		public narrative: string,
		public evidenceUrls: string,
		public amount: number
    ) {}
}