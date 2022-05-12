import ModalContext from "@/components/modal/modal.context"
import AniProvider from "@/components/provider/ani.context"
import JMKProvider from "@/components/provider/jmk.context"
import PanelProvider from "@/components/provider/panel.context"
import UserProvider from "@/components/provider/user.context"
import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const LayoutIndex = (props: PageProps) => {
	return (
		<UserProvider>
			<PanelProvider>
				<JMKProvider>
					<AniProvider>
						{/* 有其他的context放于外侧 */}
						<ModalContext>{props.children}</ModalContext>
					</AniProvider>
				</JMKProvider>
			</PanelProvider>
		</UserProvider>
	)
}

export default LayoutIndex
