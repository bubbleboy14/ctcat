cat.start = {
	_: {
		items: function() {
			return [{
				name: "structure",
				label: CT.hover.auto("Which word best describes your organization’s religious structure?",
					"Your answer will be utilized simply for convenience -- to identify your church or assembly by shorthand.  You can change this answer later if you like (same for any answers, anything can be changed at any time).", true),
				style: "radio",
				options: [
					"Church",
					"Assembly",
					{
						other: true,
						hover: "Some other examples may include:<br>Parish<br>Ecclesiastical Body<br>Body of Christ"
					}
				]
			}, {
				name: "name",
				labeller: (oz) => "What is the name of your " + oz.structure + "?"
			}, {
				name: "trust",
				label: CT.hover.auto("What name would you like for your trust?", "Choose any Trust name you like, such as Town River Fellowship Assembly Trust. It’s a good idea to put the word “Trust” at the end of the name. When you open a bank account, the account will have this name.", true),
			}, {
				name: "founders",
				label: CT.hover.auto("Please name the person or persons who will be signing this trust as the founders of the organization", "Your answer will be the person or persons creating the trust and therefore signing it.  Usually, this will be just the pastor of the church/assembly. But it could also be the Chairman of the Board, or other individuals who are founders. It’s fine to name just one founder, or name multiple founders if you prefer.", true),
				style: "fieldList"
			}, {
				name: "trustees",
				label: CT.hover.auto("Who would you like to be the initial trustee or trustees of the trust?", "The trustee is the primary person responsible for trust administration, such as the Pastor.  The ideal qualities in a trustee: (a) involved in day to day management of the church, (b) responsible with money and accounting.  Usually it is easiest to just name one trustee rather than multiple co-trustees.", true),
				style: "fieldList"
			}, {
				name: "beneficiary",
				label: CT.hover.auto("Who will be the beneficiary of the trust?", "The beneficiary of the trust is considered the true owner of the trust assets.", true),
				style: "radio",
				options: function(oz) {
					return [{
						name: "the Christian community",
						hover: "This is the most common choice.  The basic idea here is that the trust is created to advance any/all Christian community in the most general sense.  This gives you the ideal flexibility as a church to adapt to circumstances as you stay local or grow (i.e., adding more churches; collaborative projects; reaching more people; mission trips; etc).  This option is probably the most biblical of all, because it promotes Christian unity, freedom, and the Christian mission to share the gospel."
					}, {
						name: oz.name,
						hover: "This is the second most common option.  The basic idea here is that the trust would be created to advance only your specific church or assembly.  The advantage is a keen sense of focus. But the disadvantage is that it may limit your flexibility (at least initially) if you plan to adapt to circumstances as you grow (i.e., adding more churches; collaborative projects; reaching more people; mission trips; etc)."
					}, {
						name: "Jesus Christ",
						hover: "This is obviously the Messiah’s name in English.  To learn more about whether to name the Messiah as the beneficiary, click here."
					}, {
						name: "Yeshua the Messiah",
						hover: "This is the Messiah’s biblical name transliterated."
					}, {
						other: true
					}];
				}
			}, {
				name: "admin",
				labeller: (oz) => CT.hover.auto("Who in your " + oz.structure + " will have the power to appoint a trustee and remove a trustee?", "This is a very important power, because whoever has the power to appoint a trustee and remove a trustee can ultimately decide how trust assets are managed.", true),
				style: "radio",
				options: function(oz) {
					return [{
						name: oz.structure,
						hover: "This option allows for a ‘democratic’ model.  It is similar to the way that Citizens vote for an elected official. It is more time consuming, and should probably only be utilized for very small congregations."
					}, {
						name: "Pastor",
						hover: "This option fosters a paternal model, where the Pastor is ultimately responsible for leading church governance and financial accounting.  This is a good."
					}, {
						name: "Board",
						hover: "This option promotes the idea of ‘church elders’ or ‘wise ones’ leading the church finances."
					}, {
						other: true,
						hover: "One option would be to name multiple pastors or church leaders."
					}];
				}
			}, {
				name: "votes_to_entrust",
				labeller: (oz) => CT.hover.auto("Specify the percentage of votes needed for your " + oz.admin + " to appoint a trustee or remove a trustee?", "Select the minimum vote percentage you’d like to appoint a trustee or remove a trustee. For example, imagine your 7-person Board is replacing a trustee. At the Board meeting, only 5 board members attended that morning.  If you select “Majority of Voters” and “Present”, then only 3 yes votes are required to approve the trustee replacement.  But if you select “3/4 of voters” and “Eligible”, then 6 votes would be necessary to approve the trustee replacement.", true),
				style: "checkTree",
				single: true,
				structure: [{
					name: "Majority of voters",
					subs: ["Present", "Eligible"]
				}, {
					name: "3/4 of voters",
					subs: ["Present", "Eligible"]
				}, {
					name: "Unanimous",
					subs: ["Present", "Eligible"]
				}, {
					other: true
				}]
			}, {
				name: "amender",
				labeller: (oz) => CT.hover.auto("Who in your " + oz.structure + " will have the power to amend the trust or revoke the trust?", "This is a very important power, because whoever has the power to change the trust can ultimately decide how trust assets are managed.", true),
				style: "radio",
				options: function(oz) {
					return [{
						name: oz.structure,
						hover: "This option allows for a ‘democratic’ model.  It is similar to the way that Citizens vote for an elected official. It is more time consuming, and should probably only be utilized for very small congregations."
					}, {
						name: "Pastor",
						hover: "This option fosters a paternal model, where the Pastor is ultimately responsible for leading church governance and financial accounting.  This is a good."
					}, {
						name: "Board",
						hover: "This option promotes the idea of ‘church elders’ or ‘wise ones’ leading the church finances."
					}, {
						other: true
					}];
				}
			}, {
				name: "votes_to_amend",
				labeller: (oz) => CT.hover.auto("Specify the amount of votes needed for your " + oz.amender + " to amend the trust or revoke the trust?", "Select the minimum vote percentage you’d like to change the trust. For example, imagine your 7-person Board is cancelling the trust. At the Board meeting, only 5 board members attended that evening.  If you select “Majority of Voters” and “Present”, then only 3 yes votes are required to cancel the trust.  But if you select “3/4 of voters” and “Eligible”, then 6 votes would be necessary to cancel the trust.", true),
				style: "checkTree",
				single: true,
				structure: [{
					name: "Majority of voters",
					subs: ["Present", "Eligible"]
				}, {
					name: "3/4 of voters",
					subs: ["Present", "Eligible"]
				}, {
					name: "Unanimous",
					subs: ["Present", "Eligible"]
				}, {
					other: true
				}]
			}, {
				name: "has_assets",
				label: "Would you like to include a list of trust assets?",
				style: "bool"
			}, {
				name: "assets",
				condition: "has_assets",
				label: [
					CT.dom.span("Please provide a list of assets owned by the church."),
					CT.dom.pad(),
					CT.hover.auto(CT.dom.span("(For any assets owned only partially by the church, it is helpful to indicate the % owned by the church)"), "For example, “The church’s 50% ownership interest in 53 Loaves Avenue, Fishes, CA 94526”", true),
					CT.hover.auto("insert any asset(s)", "For example, an asset would be “Checking Account with Main Street Credit Union”.  Another example would be, “any real estate interests owned by ABC Church, such as 53 Loaves Avenue, Fishes, CA 94526”.  Another example is “all of the personal property such as furniture, AV equipment, and office materials located at 12 Apostles Court, Logos, CA 94527”", true)
				],
				style: "fieldList"
			}, {
				name: "state",
				labeller: (oz) => "In what State is your " + oz.structure + " primarily located?",
				style: "select",
				names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'WestVirginia', 'Wisconsin', 'Wyoming']
			}, {
				name: "has_witnesses",
				label: "In addition to being notarized, would you like your trust to be signed by two witnesses? (recommended)",
				style: "bool"
			}, {
				name: "witnesses",
				condition: "has_witnesses",
				label: "Please identify the names of the two witnesses who will sign the trust<br>insert two names",
				style: "fieldList"
			}, {
				name: "approved",
				label: [
					"Please check this box to indicate your approval to our Terms and Conditions, including for example:",
					[
						CT.dom.div("ChristianAssemblyTrust.org is a free service for the traditional Christian community.", "tabbed padded"),
						CT.dom.div("The information and documents provided on this site are for informational purposes only, and they should not be construed as personal or general legal advice or tax advice.", "tabbed padded"),
						CT.dom.div("If you like, please contact a local lawyer and tax professional near you to review and customize this trust to your jurisdiction’s law and/or your specific circumstances and goals.", "tabbed padded")
					]
				],
				style: "radio",
				options: ["Approved"]
			}];
		}
	},
	questionnaire: function(trust2edit) {
		CT.dom.setMain([
			CT.dom.div([
				CT.hover.auto(CT.dom.link("tell me more", cat.start.tellmore,
					null, "block"), "what's this all about?", true),
				CT.hover.auto(CT.dom.link("do it yourself!", function() {
					CT.modal.modal(CT.dom.div([
						CT.dom.iframe("/templates/abc.html", "w1 h600p"),
						CT.dom.link("Download docx Version", null,
							"/templates/ABC%20Church%20Trust%20v3.docx", "bigger bold")
					], "centered"));
				}, null, "block"), "Download Trust Template", true)
			], "right"),
			CT.layout.form({
				step: true,
				labels: true,
				button: true,
				backButton: true,
				backButtClass: "right",
				buttClass: "automarg block",
				items: cat.start._.items(),
				values: trust2edit && trust2edit.injections,
				onStep: (vals) => CT.storage.set("WIP", { injections: vals }),
				cb: function(opts) {
					CT.log(opts);
					CT.net.post({
						path: "/_cat",
						spinner: true,
						params: {
							action: "build",
							injections: opts,
							member: user.core.get("key"),
							key: trust2edit && (trust2edit.name == opts.name) && trust2edit.key
						},
						cb: function(t) {
							CT.modal.modal([
								CT.dom.div("Your Trust!", "bigger bold"),
								core.util.trust(t)
							], null, { innerClass: "h1 w1 centered" });
						}
					})
				}
			})
		]);
	},
	tellmore: function() {
		CT.modal.modal(CT.dom.div([
			CT.dom.div([
				"What is the Common Law Trust you’re forming here?",
				CT.dom.div("Background for Scholars and Administrators", "italic")
			], "big bold centered"), [
				CT.dom.span("Purpose.", "bold"),
				CT.dom.pad(),
				CT.dom.span("The purpose of this common law trust you’re creating is to govern and administer the assets, debts, and accounting of your church, to advance your Christian mission.  The trust is not the church itself, but rather the trust is a legal instrument to advance the church’s interests. The document can be amended or revoked at any time.")
			], [
				CT.dom.span("Analogy.", "bold"),
				CT.dom.pad(),
				CT.dom.span("Think of it like this: Your trust is like a basket that you hold separate from yourself. At any time your church can put assets into the basket (i.e., acquire cash, property, bank accounts) and also take assets out of the basket (i.e., make payments, give gifts).  The person who holds the basket and manages it is the trustee. Just as you (the human) are separate from your wallet and its contents (the property), so too the church (human) is separate from the basket and its contents (property); the church simply utilizes the basket the same way you utilize your wallet.  So the church itself is a traditional unincorporated ecclesiastical body (a fancy legal term for ‘traditional church’ with no government filings required).")
			], [
				CT.dom.span("Legal.", "bold"),
				CT.dom.pad(),
				CT.dom.span("At the completion of this questionnaire, this website will auto generate for you a common law trust based on your answers.  Legally, a common law trust is a relationship, where your named trustee (i.e., Pastor, Board, or church leadership) manages money and property for the benefit of your church, to advance your church’s nonprofit Christian mission.  All employees, contractors, and the like can still get paid working for the church; the word “nonprofit” does not require a 501c3 or any government filings.  Rather, ‘nonprofit’ just means the purpose of the church is primarily charitable or otherwise organized to advance your Christian mission.  Indeed, it is okay and good for the church to make profit, as those profits can be invested anytime toward any charitable Christian use.  Simple and traditional, with little or no government forms or filings required.  For information on taxes and accounting, click here.")
			]
		], "kidvp"));
	},
	intro: function() {
		CT.dom.setMain([
			CT.dom.div("Introduction", "big bold"),
			"Welcome to our easy questionnaire (about 15 minutes) to help you launch a new journey: forming a new church or replacing your 501c3 church with a traditional church that works best for your congregation.  Any and all Christian denominations and groups are supported here.  Same for non-denominational. Indeed, denomination does not affect your trust at all.  Your private church governance remains private and separate from the trust, so you’re free and flexible to advance your Christian mission in your complete discretion.",
			CT.dom.button("continue", () => cat.start.questionnaire(), "automarg block")
		]);
	},
	load: function() {
		var trust2edit = CT.storage.get("trust2edit"), wip = CT.storage.get("WIP");
		if (trust2edit) {
			CT.storage.set("trust2edit");
			return cat.start.questionnaire(trust2edit);
		}
		if (!wip) return cat.start.intro();
		CT.storage.set("WIP");
		CT.modal.choice({
			prompt: "You've already started filling this out. Would you like to pick up where you left off or start from scratch?",
			data: ["Load saved progress", "Start from scratch"],
			cb: function(resp) {
				if (resp == "Start from scratch")
					cat.start.intro();
				else
					cat.start.questionnaire(wip);
			}
		});
	}
};