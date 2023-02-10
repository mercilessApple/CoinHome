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
	showPwdTip:boolean
}
interface uFormModel {
	email: string,
	phone: string,
	verificationCode:string,
	loginPassword: string
}