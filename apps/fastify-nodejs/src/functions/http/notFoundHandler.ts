const notFoundHandler = (request: any, reply: any) => {
	reply.status(404).send({
		error: "Not Found",
	});
};

export default notFoundHandler;
