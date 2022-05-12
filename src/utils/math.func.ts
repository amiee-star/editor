export const setHex = (value: number) => {
	return {
		r: ((value >> 16) & 255) / 255,
		g: ((value >> 8) & 255) / 255,
		b: (value & 255) / 255
	}
}
export const getHex = (value: { r: number; g: number; b: number }) => {
	return ((255 * value.r) << 16) ^ ((255 * value.g) << 8) ^ ((255 * value.b) << 0)
}

export const getHexString = (hex: number) => {
	return ("000000" + hex.toString(16)).slice(-6)
}
export const arrayBufferToBase64 = (bytes: Uint8Array, width: number = 512, height: number = 512, quality = 0.7) => {
	for (let d = 0; d < height; ++d) {
		for (let e = 0; e < width; ++e) {
			let f = 4 * (d * width + e)
			if (d < height / 2) {
				let g = 4 * ((height - d - 1) * width + e)
				for (let h = 0; 3 > h; ++h) {
					let k = bytes[f + h]
					bytes[f + h] = bytes[g + h]
					bytes[g + h] = k
				}
			}
			bytes[f + 3] = 255
		}
	}
	const array = new Uint8ClampedArray(bytes)
	const imageData = new ImageData(array, width, height)
	const canvas = document.createElement("canvas")
	canvas.width = width
	canvas.height = height
	canvas.getContext("2d").putImageData(imageData, 0, 0)
	return canvas.toDataURL("image/jpeg", quality)
}
