import { assetData } from "@/interfaces/extdata.interface"
import { JobItem } from "@/interfaces/jmt.interface"
import EventEmitter from "eventemitter3"
interface eventList {
	"jmk.loading": (n: number) => void
	"jmk.sceneChanged": (e: any) => void
	"jmk.assetSelected": (e: assetData) => void
	"jmk.assetClick": (e: assetData) => void
	"jmk.assetAdd": (e: assetData) => void
	"jmk.assetsAddarticle": (e: any) => void
	"jmk.assetsAddaudio": (e: any) => void
	"jmk.assetsLoaded": (e: any) => void
	"jmk.positionChanged": () => void
	"tour.change": () => void
	"view.setThumb": (e: any) => void
	"jmk.camara.change": (e: any) => void
	"jmk.jobs.task": (e: JobItem[]) => void
	"jmk.name.change": () => void
	"jmk.pic.change": () => void
	"jmk.showMenu.change": () => void
	"ani.keypress": (e: any) => void
	"jmk.view.change": (e: any) => void
	"position.add": (e: any) => void
	"position.edit": (e: any) => void
	"jmk.getNewAssets": (e: any) => void
	"jmk.getVideo": (e: any) => void
	"jmk.modal.opacity": (e: any, e1: any) => void
	"jmk.setup.addCustomButtonTip": (e: any) => void
}
window["eventList"] = new EventEmitter<eventList>()
export default window["eventList"]
