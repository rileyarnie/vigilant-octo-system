import CertificationType from './CertificationType';


export class  Program {
    constructor (
  public name: string,
  public description: string,
  public prerequisiteDocumentation: string[],
  public certificationType: CertificationType,
  public requiresClearance: boolean,
  public duration: string,
  public status: string,
  public isApproved: boolean,
  public codePrefix: string
    ) {}
}

export default Program;
