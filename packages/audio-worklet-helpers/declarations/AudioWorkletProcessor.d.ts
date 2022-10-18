declare interface AudioParamDescriptor {
	/**
	 * The string which represents the name of the AudioParam.
	 * Under this name the AudioParam will be available in the parameters property of the node,
	 * and under this name the AudioWorkletProcessor.process method will acquire the calculated values of this AudioParam.
 	 */
	name: string,
	/**
	 * Either "a-rate", or "k-rate" string which represents an automation rate of this AudioParam.
	 * Defaults to "a-rate".
	*/
	automationRate?: 'a-rate' | 'k-rate'
	/**
	 * A float which represents minimum value of the AudioParam. Defaults to -3.4028235e38.
	 */
	minValue?: number,
	/**
	 * A float which represents maximum value of the AudioParam. Defaults to 3.4028235e38.
	 */
	maxValue?: number,
	/**
	 * A float which represents initial value of the AudioParam. Defaults to 0.
	 */
	defaultValue?: number,
}


/**
 * An object containing string keys and Float32Array values.
 * For each custom AudioParam defined using the parameterDescriptors getter,
 * the key in the object is a name of that AudioParam,
 * and the value is a Float32Array.
 *
 * The values of the array are calculated by taking scheduled automation events into consideration.
 *
 * If the automation rate of the parameter is "a-rate", the array will contain 128 values
 * 	— one for each frame in the current audio block.
 *  - If there's no automation happening during the time represented by the current block,
 *  - the array may contain a single value that is constant for the entire block, instead of 128 identical values.
 *
 * If the automation rate is "k-rate", the array will contain a single value, which is to be used for each of 128 frames.
 */
type ProcessParameters = Record<string, Float32Array>

/**
 * An array of inputs connected to the node, each item of which is, in turn, an array of channels.
 * Each channel is a Float32Array containing 128 samples.
 * For example, inputs[n][m][i] will access n-th input, m-th channel of that input, and i-th sample of that channel.
 * Each sample value is in range of [-1 .. 1].
 * The number of inputs and thus the length of that array is fixed at the construction of the node (see AudioWorkletNode).
 * If there is no active node connected to the n-th input of the node, inputs[n] will be an empty array (zero input channels available).
 * The number of channels in each input may vary, depending on channelCount and channelCountMode properties.
 */
type ProcessInputs = Float32Array[][]

/**
 * An array of outputs that is similar to the inputs parameter in structure.
 * It is intended to be filled during the execution of the process() method.
 * Each of the output channels is filled with zeros by default
 * — the processor will output silence unless the output arrays are modified.
 */
type ProcessOutputs = Float32Array[][]

/**
 * A Boolean value indicating whether or not to force the AudioWorkletNode
 * to remain active even if the user agent's internal logic
 * would otherwise decide that it's safe to shut down the node.
 *
 * The returned value lets your processor have influence over the lifetime policy
 * of the AudioWorkletProcessor and the node that owns it.
 *
 * If the combination of the return value and the state of the node
 * causes the browser to decide to stop the node, process() will not be called again.
 *
 * Returning true forces the Web Audio API to keep the node alive,
 * while returning false allows the browser to terminate the node
 * if it is neither generating new audio data
 * nor receiving data through its inputs that it is processing.
 */
type ProcessReturnValue = boolean

declare type AudioWorkletProcessor = {
	/**
	 * Returns a MessagePort used for bidirectional communication between the processor and the AudioWorkletNode which it belongs to.
	 * The other end is available under the port property of the node.
	 */
	readonly port: MessagePort;
	/**
	 * called in order to process the audio stream.
	 * To define custom audio processing code you have to derive a class from the AudioWorkletProcessor interface.
	 * Although not defined on the interface, the deriving class must have the process method.
	 * This method gets called for each block of 128 sample-frames
	 * and takes input and output arrays and calculated values of custom AudioParams (if they are defined) as parameters.
	 * You can use inputs and audio parameter values to fill the outputs array, which by default holds silence.
	 * */
	process(inputs: ProcessInputs, outputs: Float32Array[][], parameters: ProcessParameters): ProcessReturnValue;
	/**
	 * Optionally, if you want custom AudioParams on your node,
	 * you can supply a parameterDescriptors property as a static getter on the processor.
	 * The array of AudioParamDescriptor-based objects returned is used internally to create the AudioParams during the instantiation of the AudioWorkletNode.
	 * The resulting AudioParams reside in the parameters property of the node and can be automated using standard methods such as linearRampToValueAtTime.
	 * Their calculated values will be passed into the process() method of the processor for you to shape the node output accordingly.
	 */
	static parameterDescriptors?: AudioParamDescriptor[] | readonly AudioParamDescriptor[]
}

// eslint-disable-next-line no-var
declare var AudioWorkletProcessor:{
	prototype: AudioWorkletProcessor;
	new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
}

declare function registerProcessor(
	/** A string representing the name under which the processor will be registered. */
	name: string,
	/**
	 * The constructor of a class derived from AudioWorkletProcessor.
	 * Note: A key-value pair { name: constructor } is saved internally in the AudioWorkletGlobalScope once the processor is registered.
	 * The name is to be referred to when creating an AudioWorkletNode based on the registered processor.
	 * A new processor by the given name is internally created and associated with the new node.
	 **/
	processorCtor: (new (options?: AudioWorkletNodeOptions) => AudioWorkletProcessor) & { parameterDescriptors?: AudioParamDescriptor[] | readonly AudioParamDescriptor[]; }
): void


declare interface ParameterDescriptors {
	parameterDescriptors?: AudioParamDescriptor[];
}
