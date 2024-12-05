const Client = require("../../models/client");
const Admin = require("../../models/admin");
const Role = require("../../models/role");
const Produit = require("../../models/produit");
const Commande = require("../../models/commande");
const Panier = require("../../models/panier");
const PanierLigne = require("../../models/panierligne");
const jwt = require("jsonwebtoken");
const paypal = require('paypal-rest-sdk');
paypal.configure({
    mode: 'sandbox', // يمكن أن يكون sandbox أو live
    client_id: 'AcwqNenMYAZBQIhvt-3zXxeuveC0vOP3D60qzMvNFgftIhMhPT3GfT3kkso7VsrQ0Fgj6lEzYtAUP0G5',
    client_secret: 'EMZzQUrOku6tGjCMTE0riB6t-XjxBEMinORn0I1XH5bR-3CmX-uxLmGbWzcyIvHyVC5ycTj64tRrBo0D',
  });
var nodemailer = require('nodemailer');

class clientController {

    static async index(req, res) {

        Admin.getAllClients().then((clients) => {
            res.status(200).json(clients);

        }).catch((err) => {
            res.status(400).json({msg: "bad request " + err});
        });

    }
    static retryPassword(req,res){
        
var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'alaoui_6542_fro@outlook.com',
      pass: 'ahmedsabrei123'
    }
  });
  
  var mailOptions = {
    from: 'alaoui_6542_fro@outlook.com',
    to: 'mtazi324@gmail.com' ,
    subject: 'retry password',
    text: 'your code is 30000 ya zamel'
  };
  
  transporter.jsonMail(mailOptions, function(error, info){
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(500).json('Email sent: ' + info.responseerror)
    }
  });
    }
    static show(req, res) {

            Client.getClient(req.params.id).then((client) => {
                res.status(200).json(client);

            }).catch((err) => {
                res.status(400).json({msg: "bad request " + err});
            });

        }
        /*static (req, res) {

            Client.getClient(req.params.id).then((clients) => {
                res.status(200).json(clients);

            }).catch((err) => {
                res.status(400).json({msg: "bad request " + err});
            });

        }*/
    static showDetail(req, res) {

        Client.getClient(req.params.id).then(async(client) => {
            console.log(await client.getPanier())
            res.status(200).json({
                "clientId": client.id,
                "commandes": await client.getCommandes(),
                "panierlignes": "" /* await client.getPanier().then(async(pan) => { resolve(await pan.getPanierlignes()) })*/ ,
                "favoris": await client.getFavoris(),
            });

        }).catch((err) => {
            res.status(400).json({msg: "bad request " + err});
        });

    }
    static getCommandes(req,res){
       
           Commande.getCommandesByClient(req.params.id).then((commandes)=>{
            res.status(200).json(commandes);
           }).catch(()=>{
            res.status(500).json({msg:"err"});
           });
            

       
    }
    static getFavoris(req, res) {

        Client.getClient(req.params.id).then(async(client) => {
                 
            client.getMyFavoris().then((favoris) => {
                res.status(200).json(favoris);
            }).catch((err) => {
                res.status(400).json({msg: "bad request " + err});
            })


        }).catch((err) => {
            res.status(400).json({msg: "bad request " + err});
        });
    }
    static getPanier(req, res) {

        Client.getClient(req.params.id).then(async(client) => {

            client.getMyPanier().then((panier) => {
                res.status(201).json(panier);
            }).catch((err) => {
                res.status(400).json({msg: "bad request " + err});
            })


        }).catch((err) => {
            res.status(400).json({msg: "bad request " + err});
        });
    }

    static addToPanier(req, res) {

        Client.getClient(req.params.id).then(async(client) => {
             let panierlign= new PanierLigne(0,req.body.qte,new Date().toISOString().slice(0, 19).replace('T', ' '),req.body.produitId)
            client.addToMyPanier(panierlign).then((resultat) => {
                res.status(201).json( {msg: "created"});
            }).catch((err) => { res.status(400).json({msg: "bad request " + err}); })


        }).catch((err) => {
            res.status(400).json({msg: "bad request " + err});
        });

    }
    static addToFavoris(req, res) {

        Client.getClient(req.params.id).then(async(client) => {

            client.addToMyFavoris(req.body.produitId).then((resultat) => {
                res.status(201).json( {msg: "created"});
            }).catch((err) => { res.status(400).json({msg: "bad request " + err}); })


        }).catch((err) => {
            res.status(400).json({msg: "bad request " + err});
        });

    }
    static payement(req, res) {

       
       
        const payment = {
            intent: 'sale',
            payer: {
              payment_method: 'paypal',
            },
            redirect_urls: {
              return_url: 'http://localhost:3000/api/clients/execute?amount='+req.query.amount,
              cancel_url: 'http://cancel.url',
            },
            transactions: [
              {
                amount: {
                  total: req.query.amount,
                  currency: 'USD',
                },
                description: 'Test Payment',
              },
            ],
          };
       console.log(req.query)
          paypal.payment.create(payment, (error, payment) => {
            if (error) {
              console.error(error);
              res.sendStatus(500);
            } else {
                console.log(payment)
              const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
              res.send( `<script> location.href="${ approvalUrl }"</script>` );
              
            }
          });
          console.log("alaoui")
    }
    static addCommandesfromPanier(req,res){
Panier.getPanier(req.body.panierId).then(async (panier)=>{
              let promise=[];

              let panierlignes=panier.panierlignes;
              console.log(panierlignes)
              if(!panierlignes){
                res.status(500).json({msg:"panier vide"})
                return;
              }
           for(let panierligne of panierlignes){
                let cmde=new Commande(-1,"",panierligne.qte,"",panierligne.produit);
               promise.push(cmde.insertCommande( req.params.id));
           }
           promise.push(Panier.deleteAllFromPanier( req.body.panierId));
           Promise.all(promise).then((resu)=>{
            
            res.status(200).json({msg:"created"})
           })
    
})
    }
    static execute(req,res){
   
    
       
        const paymentId = req.query.paymentId;
        
            var execute_payment_json = {
                "payer_id": req.query.PayerID,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total":  req.query.amount
                    }
                }]
            };
            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    console.log("ali")
                    console.log(JSON.stringify(payment));
                    res.redirect("http://return_url/?status=success&id=" + payment.id + "&state=" + payment.state);
                }
            });
     
          
       
    }
    static async update(req, res) {
        new Client(req.id, req.nom, req.prenom, req.adresse,
            req.datenaissance, req.telephone,
            req.password, req.mail, new Role(3, "client")).then(() => {
            res.status(200).json({msg: "created"});
        }).catch((err) => { res.status(200).json({msg: "bad request"}); })

    }
    static deleteFromFavoris(req, res) {
        Client.getClient(req.params.id).then(async(client) => {

            client.deleteFromMyFavoris(req.params.produit).then((resultat) => {
                res.status(200).json( {msg:"deleted"});
            }).catch((err) => { res.status(400).json({msg: "bad request " + err}); })


        }).catch((err) => {
            res.status(400).json({msg: "bad request " + err});
        });
    }
    static deleteFromPanier(req, res) {
        Client.getClient(req.params.id).then(async(client) => {

            client.deleteFromMyPanier(req.params.panier).then((resultat) => {
                res.status(203).json({msg:"deleted"});
            }).catch((err) => { res.status(400).json({msg: "bad request " + err}); })


        }).catch((err) => {
            res.status(400).json({msg: "bad request " + err});
        });
    }
    static register(req, res) {

        let client = new Client(null, req.body.nom, req.body.prenom, req.body.adresse, req.body.datenaissance,
            req.body.telephone, req.body.password, req.body.mail, new Role(3, "client"));

        client.createClient().then(async() => {
            let c = await Client.getClient(client.mail);
            const token = jwt.sign({ userId: c.id,password:req.body.password, mail: c.mail,role:c.role.id },
                process.env.TOKEN_KEY
            );
            c.password=""
            c.token = token;
            res.status(201).json(c);
        }).catch((err) => {
            res.status(400).json(err);
        });
    }
    static async login(req, res) {

        console.log("ali")
        console.log(req.body)
        Client.getClient(req.body.mail).then((client) => {
            if (req.body.password == client.password) {
                const token = jwt.sign({ userId: client.id, password:client.password,email: client.email, role: client.role.id },
                    process.env.TOKEN_KEY
                );
                client.token = token;
                client.password="";
                res.status(200).json(client);
            } else
                res.status(403).json({msg:"password ou mail invalid"})
        }).catch((error) => {
            res.status(403).json(error);
        });



    }



}





module.exports = clientController;