import FeeEntries from './FeeEntries';
export default class FeeReport {
    constructor (
		public feeBalance: number,
		public FeeEntries: FeeEntries
    ) {}
}