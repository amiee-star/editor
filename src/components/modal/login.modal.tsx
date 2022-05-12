import { Button, Card, Form, Input, message, Divider } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import service from "@/services/service.user"
import { CloseOutlined } from "@ant-design/icons"
import { useIntl } from "umi"
import { ModalRef } from "./modal.context"
import { regxSPhone } from "@/utils/regexp.func"
import { userContext } from "@/components/provider/user.context"
import "./login.modal.less"
import md5 from "js-md5"
import lsFunc from "@/utils/ls.func"
let countTimer: any = null

interface Props {}

const LoginModal: React.FC<Props & ModalRef> = props => {
	const Intl = useIntl()
	const { modalRef } = props
	const { state, dispatch } = useContext(userContext)
	const [loginType, setLoginType] = useState(true) // false为验证码登录， true为密码登录
	const [form] = Form.useForm()
	const [count, setCount] = useState(60)
	const [stopSendCode, setStopSendCode] = useState(true)
	useEffect(() => {
		return () => {
			clearInterval(countTimer)
		}
	}, [state])
	// 更换登录方式
	const changeLoginType = useCallback(() => {
		setLoginType(!loginType)
	}, [loginType])

	const isCounting = useMemo(() => {
		if (count == 0 || !countTimer) {
			return "获取验证码"
		} else {
			return count
		}
	}, [count])
	// 获取验证码
	const getcode = useCallback(() => {
		const errorlist = form.getFieldError("telephone")
		if (errorlist.length > 0) return
		const timeCounter = (count: number) => {
			countTimer = setTimeout(() => {
				if (count == 1) {
					clearInterval(countTimer)
					return
				}
				isCounting
				setCount(count - 1)
				timeCounter(count - 1)
			}, 1000)
		}
		service.sendCode(form.getFieldValue("telephone")).then(rslt => {
			if (rslt.code === 200) {
				message.success("发送成功")
				setCount(count)
				timeCounter(count)
			} else {
				message.warn(rslt.errorMsg)
			}
		})
	}, [count])
	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const changeURLArg = (url, arg, arg_val) => {
		var pattern = arg + "=([^&]*)"
		var replaceText = arg + "=" + arg_val
		if (url.match(pattern)) {
			var tmp = "/(" + arg + "=)([^&]*)/gi"
			tmp = url.replace(eval(tmp), replaceText)
			return tmp
		} else {
			if (url.match("[?]")) {
				return url + "&" + replaceText
			} else {
				return url + "?" + replaceText
			}
		}
	}
	// 登录
	const onFinish = useCallback(
		data => {
			if (loginType) {
				data.password = md5(data.password)
				service.passLogin(data).then(rslt => {
					console.log(rslt, "rslt!!!!!!!!!")
					if (rslt.code === 200) {
						console.log("登录")
						window.location.href = changeURLArg(window.location.href, "token", rslt.data.accessToken)
						lsFunc.setItem("accessToken", rslt.data.accessToken)
					}
				})
				// .finally(() => {
				// 	if (Object.values(state).length === 0) {
				// 		location.reload()
				// 	}
				// 	modalRef.current.destroy()
				// })
			} else {
				service.codeLogin(data).then(rslt => {
					if (rslt.code === 200) {
						// dispatch({
						// 	type: "setData",
						// 	payload: {
						// 		accessToken: rslt.data.accessToken
						// 	}
						// })
						window.location.href = changeURLArg(window.location.href, "token", rslt.data.accessToken)
						lsFunc.setItem("accessToken", rslt.data.accessToken)
					}
				})
				// .finally(() => {
				// 	if (Object.values(state).length === 0) {
				// 		location.reload()
				// 	}
				// 	modalRef.current.destroy()
				// })
			}
		},
		[loginType]
	)
	const changeForm = (e: any) => {
		const phone = e.telephone
		const res = regxSPhone.test(phone)
		if (!res) {
			setStopSendCode(true)
		} else {
			setStopSendCode(false)
		}
	}
	return (
		<Card
			className="loginModal"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Divider className="divider">
				{loginType ? Intl.formatMessage({ id: "login.wordTitle" }) : Intl.formatMessage({ id: "login.codeTitle" })}
			</Divider>
			<Form
				form={form}
				labelCol={{ span: 4 }}
				layout="vertical"
				preserve={false}
				onFinish={onFinish}
				onValuesChange={changeForm}
			>
				{loginType ? (
					<>
						<Form.Item
							name="username"
							required
							rules={[{ required: true, message: Intl.formatMessage({ id: "login.required.username" }) }]}
						>
							<Input size="large" placeholder={Intl.formatMessage({ id: "login.required.username" })} />
						</Form.Item>
						<Form.Item
							name="password"
							required
							rules={[{ required: true, message: Intl.formatMessage({ id: "login.required.password" }) }]}
						>
							<Input size="large" type="password" placeholder={Intl.formatMessage({ id: "login.required.password" })} />
						</Form.Item>
					</>
				) : (
					<>
						<Form.Item
							name="telephone"
							required
							rules={[
								{ required: true, max: 11, message: Intl.formatMessage({ id: "login.required.phone" }) },
								{ pattern: regxSPhone, message: Intl.formatMessage({ id: "login.right.phone" }) }
							]}
						>
							<Input size="large" placeholder={Intl.formatMessage({ id: "login.required.phone" })} />
						</Form.Item>
						<div className="f-pr">
							<Form.Item
								name="verificationCode"
								required
								rules={[{ required: true, message: Intl.formatMessage({ id: "login.required.code" }) }]}
							>
								<Input
									size="large"
									style={{ width: "62%" }}
									placeholder={Intl.formatMessage({ id: "login.required.code" })}
								/>
							</Form.Item>
							<Button
								className="getcoode"
								onClick={getcode}
								size="large"
								style={{ width: "35%" }}
								type="primary"
								disabled={stopSendCode}
							>
								{isCounting}
							</Button>
						</div>
					</>
				)}
				{/* <div className="changeLoginType" onClick={changeLoginType}>
					{loginType ? Intl.formatMessage({ id: "login.codeTitle" }) : Intl.formatMessage({ id: "login.wordTitle" })}
				</div> */}
				<Form.Item>
					<Button size="large" block type="primary" htmlType="submit">
						登录
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}
export default LoginModal
