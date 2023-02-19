// Exists to fix a frustrating type check issue
declare module '*.png' {
	const value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	export default value;
}
