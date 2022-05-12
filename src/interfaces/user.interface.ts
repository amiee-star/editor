export interface userData {
	phone: string
}
export interface loginCode {
  telephone: string
  verificationCode?: string
}
export interface loginPassword {
  username: string
  password?: string
}
export interface tokenInfo {
  accessToken: string
}
export interface userInfo {
  devFlag: boolean
  origin: number
  isShowCloudSceneLogo?: boolean | null
}
