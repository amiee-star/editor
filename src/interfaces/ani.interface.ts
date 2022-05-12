export interface aniData {
	channels: aniChannel[]
	sampleFrame: number
	samplers: aniSampler[]
}

export interface aniChannel {
	sampler: number
	target: aniTarget
}

export interface aniTarget {
	node: string
	path: string
}

export interface aniSampler {
	input: number[]
	interpolation: number
	output: number[][] | number[]
}
