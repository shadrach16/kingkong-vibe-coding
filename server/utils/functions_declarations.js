

const sendEmail = (params)=>{
	console.log(`Sending email from: ${params.from}, to: ${params.to}, subject: ${params.subject}, body: ${params.body}`) ;
	return `Email sent to ${params.to}`
}

const createTicket = (params)=>{
	console.log(`Creating ticket: ${params.title}, description: ${params.description}`) ;
}

const getWeather = (params)=>{
		console.log(`gettign weather: ${params.city}`) ;

}

 

const functions_args= [
   "!sendEmail(from, to, subject, body)",
     "!createTicket(title,description)",
     "!getWeather(city)",
]

export const internal_functions =  {
  "!sendEmail":sendEmail,
     "!getWeather":getWeather,
     "!createTicket":createTicket,
}


export default functions_args;