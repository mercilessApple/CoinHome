interface DATA {
	sbsection: string[],
	current: number,
	uFormModel: uFormModel,
	uFormRules: any,
	isShowPwd: boolean,
	checked:string[],
	time:number,
	loading:boolean,
	phoneAreaCode:string,
	showPwdTip:boolean,
	inviteCode:string
}
interface uFormModel {
	email: string,
	phone: string,
	verificationCode:string,
	loginPassword: string
}