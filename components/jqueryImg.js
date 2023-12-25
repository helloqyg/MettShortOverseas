
export function imgAxios(config){
	const instance = uni.request({
		url:'https://img.nymaite.com/nymaite_com/static/m/js/jquery.min.js',
		method:'GET',
		success:(res)=>{
			console.log(res)
		}
	})
	return instance(config)
}