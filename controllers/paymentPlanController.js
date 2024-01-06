const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");

const CreatePaymentPlan = async (req, res) => {
	try {
		const data = req.body;
		let Units = [];
		if (data.PropertyUnits) {
			data.PropertyUnits.forEach((unit) =>
				Units.push({
					id: unit,
				}),
			);
		} else {
			if (data.propertyID) {
				Units = await prisma.propertyUnits.findMany({
					where: {
						propertyId: data.propertyID,
					},
					select: {
						id: true,
					},
				});
			}
		}
		data.TotalMonths = parseInt(data.TotalMonths);
		data.NoOfPosthandoverMonths = parseInt(data.NoOfPosthandoverMonths);
		data.DuringConstructionMonths = parseInt(data.DuringConstructionMonths);
		data.DownPayemnt = parseFloat(data.DownPayemnt);
		data.DuringConstructionPercentage = parseFloat(
			data.DuringConstructionPercentage,
		);
		data.PosthandoverPercentage = parseFloat(data.PosthandoverPercentage);
		data.OnHandoverPercentage = parseFloat(data.OnHandoverPercentage);
		const results = await prisma.$transaction(async (prisma) => {
			let Installments = [];
			let handoverInstallmentNo = data.TotalMonths;

			const Price = 1200000;
			if (data.Installments.length === 0 || data.Installments === undefined) {
				if (data.Posthandover) {
					handoverInstallmentNo -= data.NoOfPosthandoverMonths;
					console.log("HandOVer Installment #: ", handoverInstallmentNo);
					PostHandoverMonth = data.TotalMonths - handoverInstallmentNo;
					console.log("PostHandoverMonth: ", PostHandoverMonth);
					for (let i = 0; i < data.TotalMonths; i++) {
						//if it is the first installment
						console.log("Item: ", i);
						if (i == 0) {
							Installments[i] = {
								Number: i + 1,
								Description: "Downpayment",
								PercentageOfPayment: data.DownPayemnt,
								Amount: (data.DownPayemnt / 100) * Price,
								Date: new Date(data.HandoverDate),
							};
						} else if (i == handoverInstallmentNo) {
							//if it is handover installment
							Installments[i] = {
								Number: i + 1,
								Description: "On Handover",
								PercentageOfPayment: data.OnHandoverPercentage,
								Amount: (data.OnHandoverPercentage / 100) * Price,
								Date: data.HandoverDate,
							};
						} else if (data.TotalMonths - i <= PostHandoverMonth) {
							//if it is posthandover installment
							Installments[i] = {
								Number: i + 1,
								Description: "Post Handover Installment No. " + i,
								PercentageOfPayment:
									data.PosthandoverPercentage / data.NoOfPosthandoverMonths,
								Amount:
									(data.PosthandoverPercentage /
										data.NoOfPosthandoverMonths /
										100) *
									Price,
								Date: new Date(data.HandoverDate),
							};
						} else {
							//durning construction
							Installments[i] = {
								Number: i + 1,
								Description: "Installment No. " + i,
								PercentageOfPayment:
									data.DuringConstructionPercentage /
									data.DuringConstructionMonths,
								Amount:
									(data.DuringConstructionPercentage /
										data.DuringConstructionMonths /
										100) *
									Price,
								Date: new Date(data.HandoverDate),
							};
						}
					}
				} else {
					for (let i = 0; i < data.TotalMonths; i++) {
						//if it is the first installment
						if (i == 0) {
							Installments[i] = {
								Number: i + 1,
								Description: "Downpayment",
								PercentageOfPayment: data.DownPayemnt,
								Amount: (data.DownPayemnt / 100) * Price,
								Date: new Date(data.HandoverDate),
							};
						} else if (i == handoverInstallmentNo - 1) {
							//if it is handover installment
							Installments[i] = {
								Number: i + 1,
								Description: "On Handover",
								PercentageOfPayment: data.OnHandoverPercentage,
								Amount: (data.OnHandoverPercentage / 100) * Price,
								Date: data.HandoverDate,
							};
						} else {
							//durning construction
							Installments[i] = {
								Number: i + 1,
								Description: "Installment No. " + i,
								PercentageOfPayment:
									data.DuringConstructionPercentage /
									data.DuringConstructionMonths,
								Amount:
									(data.DuringConstructionPercentage /
										data.DuringConstructionMonths /
										100) *
									Price,
								Date: new Date(data.HandoverDate),
							};
						}
					}
				}
			} else {
				Installments = data.Installments;
			}
			const LangIDS = await prisma.languages.findMany({
				select: {
					id: true,
				},
			});
			Installments.map((installment) => {
				let TranslationData = [];
				if (installment.Installments_Translation === undefined) {
					LangIDS.map((Lang) => {
						TranslationData.push({
							Description: installment.Description,
							languagesId: Lang.id,
						});
					});
					installment.Installments_Translation = {
						data: TranslationData,
					};
				} else {
					installment.Installments_Translation = {
						data: installment.Installments_Translation,
					};
				}
			});
			// Installments.map((x) => {
			// 	console.log(x.Installments_Translation);
			// });
			const NewPaymentPlan = await prisma.paymentPlan.create({
				data: {
					DownPayemnt: parseFloat(data.DownPayemnt),
					DuringConstructionMonths: parseInt(data.DuringConstructionMonths),
					DuringConstructionPercentage: parseFloat(
						data.DuringConstructionPercentage,
					),
					TotalMonths: parseInt(data.TotalMonths),
					Posthandover: data.Posthandover,
					NoOfPosthandoverMonths: parseInt(data.NoOfPosthandoverMonths),
					PosthandoverPercentage: parseFloat(data.PosthandoverPercentage),
					OnHandoverPercentage: parseFloat(data.OnHandoverPercentage),
					HandoverDate: new Date(data.HandoverDate),
					propertyUnits: {
						connect: Units,
					},
					Installments: {
						create: Installments.map((item) => ({
							Number: parseInt(item.Number),
							PercentageOfPayment: parseFloat(item.PercentageOfPayment),
							Amount: parseFloat(item.Amount),
							Date: new Date(data.HandoverDate),
							Installments_Translation: {
								createMany: item.Installments_Translation,
							},
						})),
					},
				},
				include: {
					Installments: {
						include: {
							Installments_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					propertyUnits: true,
				},
			});
			return NewPaymentPlan;
		});
		return res.status(201).send(results);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist! \n" + error.message);
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			} else if (error.code === "P2002") {
				return res.status(404).send(error.message);
			} else if (error.code === "P2003") {
				return res
					.status(404)
					.send(
						"Foreign key constraint failed, Connection Field Doesn't Exist!",
					);
			}
		}
		return res.status(500).send(error.message);
	}
};

const GetAllPaymentPlans = async (req, res) => {
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [PaymentPlan, count] = await prisma.$transaction([
			prisma.paymentPlan.findMany({
				skip: offset || undefined,
				take: limit || undefined,
				include: {
					Installments: {
						include: {
							Installments_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					propertyUnits: {
						include: {
							Property: true,
						},
					},
				},
			}),
			prisma.paymentPlan.count({}),
		]);
		if (!PaymentPlan) {
			return res.status(404).send("No Payment plans Were Found!");
		}
		res.status(200).json({
			count,
			PaymentPlan,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
//Get Payment Plan By ID
const GetPaymentPlanByID = async (req, res) => {
	try {
		const id = req.params.id;
		const PaymentPlan = await prisma.paymentPlan.findUnique({
			where: {
				id,
			},
			include: {
				Installments: {
					include: {
						Installments_Translation: {
							include: {
								Language: true,
							},
						},
					},
					orderBy: {
						Number: "asc",
					},
				},
				propertyUnits: {
					include: {
						Property: true,
					},
				},
			},
		});
		if (!PaymentPlan) {
			return res.status(404).send("No Payment plans Were Found!");
		}
		res.status(200).send(PaymentPlan);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

//Get Payment Plans by Property Unit ID
const GetPaymentPlanByPropertyUnitID = async (req, res) => {
	try {
		const id = req.params.id;
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [PaymentPlan, count] = await prisma.$transaction([
			prisma.paymentPlan.findMany({
				where: {
					propertyUnits: {
						some: {
							id: {
								in: [id],
							},
						},
					},
				},
				skip: offset || undefined,
				take: limit || undefined,
				include: {
					Installments: {
						include: {
							Installments_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					propertyUnits: {
						include: {
							Property: true,
						},
					},
				},
			}),
			prisma.paymentPlan.count({
				where: {
					propertyUnits: {
						some: {
							id: {
								in: [id],
							},
						},
					},
				},
			}),
		]);
		if (!PaymentPlan) {
			return res.status(404).send("No Payment plans Were Found!");
		}
		res.status(200).json({
			count,
			PaymentPlan,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

//Installment depending on property unit

// const GetInstallmentsForPropertyUnits = async (req,res) =>{

// }

//Update Payment Plan

const UpdatePaymentPlan = async (req, res) => {
	const id = req.params.id;
	const updates = Object.keys(req.body);
	const Selected = { id: true };
	let Units = [];

	if (updates.PropertyUnits) {
		updates.PropertyUnits.forEach((unit) =>
			Units.push({
				id: unit,
			}),
		);
	} else {
		if (updates.propertyID) {
			Units = await prisma.propertyUnits.findMany({
				where: {
					propertyId: updates.propertyID,
				},
				select: {
					id: true,
				},
			});
		}
	}
	updates.forEach((item) => {
		Selected[item] = true;
	});
	const result = await prisma.$transaction(async (prisma) => {
		if (req.body.Installments !== undefined) {
			req.body.Installments.map(async (item) => {
				await prisma.installments.update({
					where: { id: item.id },
					data: {
						Amount: parseFloat(item.Amount),
						Number: parseInt(item.Number),
						PercentageOfPayment: parseFloat(item.PercentageOfPayment),
						Date: item.Date,
						Installments_Translation: {
							updateMany: item.Installments_Translation.map((translation) => ({
								where: {
									AND: [
										{
											installmentsId: item.id,
										},
										{
											languagesId: translation.languagesId,
										},
									],
								},
								data: {
									Description: translation.Description,
								},
							})),
						},
					},
				});
			});
		}
		const UpdatedInstallments = await prisma.paymentPlan.update({
			where: {
				id: id,
			},
			data: {
				DownPayemnt: parseFloat(req.body.DownPayemnt),
				DuringConstructionMonths: parseInt(req.body.DuringConstructionMonths),
				DuringConstructionPercentage: parseFloat(
					req.body.DuringConstructionPercentage,
				),
				TotalMonths: parseInt(req.body.TotalMonths),
				Posthandover: req.body.Posthandover,
				NoOfPosthandoverMonths: parseInt(req.body.NoOfPosthandoverMonths),
				PosthandoverPercentage: parseFloat(req.body.PosthandoverPercentage),
				OnHandoverPercentage: parseFloat(req.body.OnHandoverPercentage),
				HandoverDate: new Date(req.body.HandoverDate),
				propertyUnits: {
					connect: Units,
				},
			},
			include: {
				Installments: {
					include: {
						Installments_Translation: {
							include: {
								Language: true,
							},
						},
					},
					orderBy: {
						Number: "asc",
					},
				},
				propertyUnits: true,
			},
		});
		// console.log("Updated: ", UpdatedInstallments);
		return UpdatedInstallments;
	});
	return res.status(200).json({
		Message: "Updated successfully",
		result,
	});
};

const DeletePaymentPlan = async (req, res) => {
	try {
		const id = req.params.id;
		const PaymentPlan = await prisma.paymentPlan.findFirst({
			where: {
				id,
			},
			include: {
				Installments: {
					include: {
						Installments_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
				propertyUnits: {
					include: {
						Property: true,
					},
				},
			},
		});
		if (!PaymentPlan) {
			return res.status(404).send("Payment Plan Does not Exist!");
		}
		let installmentsIDS = [];
		PaymentPlan.Installments.map((installment) => {
			installmentsIDS.push(installment.id);
		});
		const result = await prisma.$transaction(async (prisma) => {
			if (PaymentPlan.Installments.length > 0) {
				PaymentPlan.Installments.map(async (item) => {
					await prisma.installments_Translation.deleteMany({
						where: {
							installmentsId: item.id,
						},
					});
					await prisma.installments.deleteMany({
						where: {
							id: item.id,
						},
					});
				});
			}
			await prisma.paymentPlan.delete({
				where: {
					id: id,
				},
			});
			return "Payment Plan Successfully Deleted";
		});
		res.status(200).send(result);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist!");
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			}
		}
		return res.status(500).send(error.message);
	}
};

module.exports = {
	CreatePaymentPlan,
	GetAllPaymentPlans,
	GetPaymentPlanByID,
	GetPaymentPlanByPropertyUnitID,
	UpdatePaymentPlan,
	DeletePaymentPlan,
};
