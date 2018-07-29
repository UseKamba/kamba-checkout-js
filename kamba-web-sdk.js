function ready (fn)
{
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(function(){
    //Style for button Pay with Kamba - Merchant
    var btnOpenWidgetKamba = document.querySelector(".btnOpenWidgetKamba");
    btnOpenWidgetKamba.innerHTML = "Pagar com a Kamba";
    var imgButtonKamba = document.createElement("img");
    imgButtonKamba.src="images/PayLogo-kamba.png";
    imgButtonKamba.classList.add("classImgButtonKamba");         
    btnOpenWidgetKamba.appendChild(imgButtonKamba);
    
    var classImgButtonKamba = document.querySelector(".classImgButtonKamba");
    classImgButtonKamba.style.width = '25%';
    classImgButtonKamba.style.marginLeft = '0.5rem';
      
    btnOpenWidgetKamba.style.backgroundImage = 'linear-gradient(to left, #00FFB3, #00ff5f)';
    btnOpenWidgetKamba.style.border = 'none';
    btnOpenWidgetKamba.style.padding = '0.5rem';
    btnOpenWidgetKamba.style.cursor = 'pointer';
    btnOpenWidgetKamba.style.fontSize = '1rem';
    btnOpenWidgetKamba.style.borderRadius = '0.3rem';
    btnOpenWidgetKamba.style.fontFamily = "'Montserrat', sans-serif";
    btnOpenWidgetKamba.style.display = 'flex';
    btnOpenWidgetKamba.style.justifyContent = 'center';
    btnOpenWidgetKamba.style.alignItems = 'center';
    btnOpenWidgetKamba.style.boxSizing = 'border-box';

});



(function () {
(function bootstrap() {
        'use strict'

        window.KAMBA = window.KAMBA || {};

        window.kamba = function kamba(initial_config, secondary_config) {

            function ready (fn){
                if (document.readyState != 'loading') {
                    fn();
                } else {
                    document.addEventListener('DOMContentLoaded', fn);
                }
            }

            ready(function(){
                //Send - Post request

                let url;
                let token = 'Token ';

                if (secondary_config.enviroment == 'sandbox'){
                    url = "https://sandbox.usekamba.com/v1/checkouts/";
                }else{
                    url = "https://api.usekamba.com/v1/checkouts/";
                }

                fetch(url, {method: 'POST',
                    headers: {
                                'Content-Type': 'application/json',
                                'authorization': token.concat(secondary_config.api_key)
                            }, 
                    body:  JSON.stringify({
                            channel: initial_config.channel,
                            currency: initial_config.currency,
                            initial_amount: initial_config.initial_amount,
                            notes: initial_config.notes,
                            redirect_url_success: initial_config.redirect_url_success,
                            payment_method: initial_config.payment_method
                        })

                }).then(function(response) {
                  if(response.ok) {

                    response.json().then(data => {

                    //To transform

                    var initial_amount = new Number(data.initial_amount);
                    var total_amount = new Number(data.total_amount);

                    var dateConvert = new Date(data.created_at);
                    var newDateConvert = [dateConvert.getDate(), dateConvert.getMonth(), dateConvert.getFullYear()].join('/')+' às '+[dateConvert.getHours(), dateConvert.getMinutes(), dateConvert.getSeconds()].join(':');


                    var mainKambaModalContainer = document.createElement("main");
                   
                    //Modal Container
                    var kambaModalContainer = document.getElementsByTagName("body")[0].appendChild(mainKambaModalContainer);
                    kambaModalContainer.classList.add("kambaModalContainer");
                    kambaModalContainer.style.width = '100vw';
                    kambaModalContainer.style.height = '100%';
                    kambaModalContainer.style.background = 'rgba(0,0,0,.4)';
                    kambaModalContainer.style.position = 'fixed';
                    kambaModalContainer.style.top = '0';
                    kambaModalContainer.style.left = '0';
                    kambaModalContainer.style.zIndex = '1000000000000000000000';
                    kambaModalContainer.style.display = 'flex';
                    kambaModalContainer.style.justifyContent = 'center';
                    kambaModalContainer.style.alignItems = 'center';
                    kambaModalContainer.style.boxSizing = 'border-box';
                    kambaModalContainer.style.paddingRight = '1rem';
                    kambaModalContainer.style.overflow = 'auto';


                    //Template
                    const kambaWidget = `

                    <div class="kambaModalWidget">

                        <header class="checkoutHeader">
                             
                            <img src="images/KambaLogoGreen-kamba.png" class="imgLogoKamba"> 

                        </header>
                     
                        <section>

                            <article class="headerWidget">
                                
                                <div class="qrPart">

                                    <div class="detailQr">
                                        
                                        <div class="divSvg">
                                            <svg class="imgQr">
                                                ${data.qr_code.svg}
                                            </svg>
                                        </div>

                                        <div class="textQr">
                                            <div class="textValidate">
                                                Válido até: ${newDateConvert}
                                            </div>
                                        </div>
                                    </div>
                             
                                
                                </div>

                                
                                <div class="partDetailPay">
                                    <div class="securityPay">
                                        <a href="#" class="textSecurityPay"><img src="images/icons8-lock-kamba.png" class="lock"> <span class="ps"> Pagamento seguro</span></a>
                                    </div>


                                    <div class="payDetail">
                                        <h3>Detalhes do pagamento</h3>

                                        <ul class="listProprietyProduct">
                                            <li class="nameProduct"><b> ${data.notes} </b></li>
                                            <li class="priceProduct"><b>${initial_amount.toLocaleString('pt-br', {style: 'currency', currency: 'AKZ'})} </b></li>
                                        </ul>

                                        <ul class="listTotal">
                                            <li class="descriptionTotal"><b>TOTAL</b></li>
                                            <li class="priceTotal"><b>${total_amount.toLocaleString('pt-br', {style: 'currency', currency: 'AKZ'})} </b></li>
                                        </ul>
                                    </div>

                                </div>
                                 
                                          
                            </article>
                            <article>

                                <div  class="descriptionKamba">
                                    <div class="descritionKambaMerchant">Você está a pagar <b> ${data.merchant.business_name} </b>
                                    </div>
                                    
                                    <div class="btnCloseWidgetKamba">
                                        Fechar
                                    </div> 
                                    
                                </div>
             
                            </article>

                        </section>
                    </div>`
                    kambaModalContainer.innerHTML = kambaWidget;

                    //Style Widget Modal
                    var kambaModalWidget = document.querySelector("main .kambaModalWidget");
                    kambaModalWidget.style.borderRadius = '0.2rem';
                    kambaModalWidget.style.overflow = 'auto';
                    kambaModalWidget.style.background = '#fff';
                    kambaModalWidget.style.width = '100%';
                    kambaModalWidget.style.height = '100%';
                    kambaModalWidget.style.position = 'absolute';
                    kambaModalWidget.style.fontFamily = "'Montserrat', sans-serif";
                    kambaModalWidget.style.fontSize = '0.95rem';
                    kambaModalWidget.style.boxShadow = '0 5px 8px 0 rgba(0,0,0,.2), 0 7px 20px 0 rgba(0,0,0,.10)';

                    //Header
                    var checkoutHeader = document.querySelector(".checkoutHeader");
                    checkoutHeader.style.padding = '1rem 0 0 1rem';

                    var imgLogoKamba = document.querySelector(".imgLogoKamba");
                    imgLogoKamba.style.float = 'left';
                    imgLogoKamba.style.width = '7%';
                
                    //Body
                    var headerWidget = document.querySelector(".headerWidget");
                    headerWidget.style.width = '100%';
                    headerWidget.style.float = 'left';
                    headerWidget.style.boxShadow = '0px 0px 1px #7f7f7f';
                    headerWidget.style.marginTop = '1rem';
                    headerWidget.style.background = 'white';

                    var qrPart = document.querySelector(".qrPart");
                    qrPart.style.width = '100%';
                    qrPart.style.background = "#00ff5f";
                    qrPart.style.position = 'relative';
                    qrPart.style.float = 'left';

                    var detailQr = document.querySelector(".detailQr");
                    detailQr.style.width = '100%';
                    detailQr.style.float = 'left';
                    detailQr.style.background = 'white';
                    detailQr.style.boxSizing = 'border-box';

                    var divSvg = document.querySelector(".divSvg");
                    divSvg.style.textAlign = 'center';
                    divSvg.style.padding = '1rem';
                    divSvg.style.width = '90%';
                    divSvg.style.height = '12rem';

                    var imgQr = document.querySelector(".imgQr");
                    imgQr.style.width = '100%';
                    imgQr.style.height = '100%';

                    var textQr = document.querySelector(".textQr");
                    textQr.style.width = '100%';
                    textQr.style.background = 'white';
                    textQr.style.float = 'left';
                    textQr.style.padding = '0 0 1rem 0';
                    textQr.style.boxSizing = 'border-box';

                    var textValidate = document.querySelector(".textValidate");
                    textValidate.style.textAlign = 'center';
                    textValidate.style.fontSize = '0.8rem';

                    //Pay Detail
                    var partDetailPay = document.querySelector(".partDetailPay");
                    partDetailPay.style.width = '100%';
                    partDetailPay.style.float = 'left';
                    partDetailPay.style.background = 'white';

                    var securityPay = document.querySelector(".securityPay");
                    securityPay.style.marginRight = '1rem';
                    securityPay.style.float = 'right';
                    securityPay.style.marginTop = '1.5rem';

                    var textSecurityPay = document.querySelector(".textSecurityPay");
                    textSecurityPay.style.textDecoration = 'none';
                    textSecurityPay.style.display = 'flex';
                    textSecurityPay.style.justifyContent = 'center';
                    textSecurityPay.style.alignItems = 'center';
                    textSecurityPay.style.boxSizing = 'border-box';

                    var ps = document.querySelector(".ps");
                    ps.style.marginLeft = '0.2rem';
                    ps.style.color = '#666666';
                    ps.fontSize = '0.8rem';

                    var payDetail = document.querySelector(".payDetail");
                    payDetail.style.width = '92%';
                    payDetail.style.float = 'left';
                    payDetail.style.margin = '1rem';

                    var payDetailH3 = document.querySelector(".payDetail h3");
                    payDetailH3.style.color = '#7C7979';
                    payDetailH3.style.fontSize = '1rem';

                    var listProprietyProduct = document.querySelector(".listProprietyProduct");
                    listProprietyProduct.style.width = '100%';
                    listProprietyProduct.style.listStyle = 'none';
                    listProprietyProduct.style.float = 'left';
                    listProprietyProduct.style.marginLeft = '0';
                    listProprietyProduct.style.paddingLeft = '0';
                    listProprietyProduct.style.background = 'white';
                    listProprietyProduct.style.borderTop = '1px solid #f4f0f0';

                    var nameProduct = document.querySelector(".nameProduct");
                    nameProduct.style.float = 'left';

                    var priceProduct = document.querySelector(".priceProduct");
                    priceProduct.style.float = 'right';

                    var listTotal = document.querySelector(".listTotal");
                    listTotal.style.width = '100%';
                    listTotal.style.listStyle = 'none';
                    listTotal.style.float = 'left';
                    listTotal.style.marginLeft = '0';
                    listTotal.style.paddingLeft = '0';
                    listTotal.style.background = 'white';
                    listTotal.style.borderTop = '1px solid #f4f0f0';

                    var descriptionTotal = document.querySelector(".descriptionTotal");
                    descriptionTotal.style.float = 'left';

                    var priceTotal = document.querySelector(".priceTotal");
                    priceTotal.style.float = 'right';

                    var descriptionKamba = document.querySelector(".descriptionKamba");
                    descriptionKamba.style.width = '90%';
                    descriptionKamba.style.padding = '1rem';
                    descriptionKamba.style.float = 'left';
                    descriptionKamba.style.textAlign = 'center';

                    var descritionKambaMerchant = document.querySelector(".descritionKambaMerchant");

                    var btnCloseWidgetKamba = document.querySelector(".btnCloseWidgetKamba");
                    btnCloseWidgetKamba.title = 'Sair do pagamento';
                    btnCloseWidgetKamba.style.border = 'none';
                    btnCloseWidgetKamba.style.cursor = 'pointer';
                    btnCloseWidgetKamba.style.fontSize = '1rem';
                    btnCloseWidgetKamba.style.boxSizing = 'border-box';
                    btnCloseWidgetKamba.style.borderRadius = '0.3rem';
                    btnCloseWidgetKamba.style.float = 'right';
                    btnCloseWidgetKamba.style.color = 'red';

                    btnCloseWidgetKamba.onclick = function(){
                        kambaModalContainer.style.display = 'none';
                    };

                    //Button for Pay Kamba
                    document.querySelector(".btnOpenWidgetKamba").onclick = function(){
                        kambaModalContainer.style.display = 'flex';
                    };

                    //Function Midia Query

                    //MEDIUM
                    function midiaMediumDivice(x) {
                        if (x.matches) { 
                             kambaModalWidget.style.width = '85%';
                             kambaModalWidget.style.height = '62%';
                             qrPart.style.width = '50%';
                             partDetailPay.style.width = '48%';
                             qrPart.style.float = 'left';
                             partDetailPay.style.float = 'left';
                             descritionKambaMerchant.style.float = 'left';
                             imgLogoKamba.style.width = '4%';
                             descriptionKamba.style.width = '94%';
                        }
                    }

                    var x = window.matchMedia("(min-width: 641px)")
                    midiaMediumDivice(x)
                    x.addListener(midiaMediumDivice)

                    //LARGE
                    function midiaLargeDivice(x) {
                        if (x.matches) {   
                            kambaModalWidget.style.width = '57%';
                            kambaModalWidget.style.height = '62%';
                            qrPart.style.width = '50%';
                            partDetailPay.style.width = '48%';
                            qrPart.style.float = 'left';
                            partDetailPay.style.float = 'left';  
                            descritionKambaMerchant.style.float = 'left';
                            imgLogoKamba.style.width = '4%';
                            descriptionKamba.style.width = '94%';
                        } 
                    }

                    var x = window.matchMedia("(min-width: 1025PX)")
                    midiaLargeDivice(x)
                    x.addListener(midiaLargeDivice)

                    });

                  } else {
                    //console.log('Network response was not ok.');

                    response.json().then(data => {

                      templateModalErrorPayKamba();

                      var textErrorKamba = document.querySelector(".textErrorKamba");
                      textErrorKamba.innerHTML = "Falha!... Verifique suas configurações de pagamento ou entra em contacto com a equipe da Kamba";
                      
                    });

                  }
                })
                .catch(function(error) {
        
                  templateModalErrorPayKamba();

                  var textErrorKamba = document.querySelector(".textErrorKamba");
                  textErrorKamba.innerHTML = "Falha!... Verifique sua conexão com a internet, ela pode estar muito lenta";
                });
               


               function templateModalErrorPayKamba(){
                   var mainKambaModalContainer = document.createElement("main");
                   
                    //Modal Container
                    var kambaModalContainer = document.getElementsByTagName("body")[0].appendChild(mainKambaModalContainer);
                    kambaModalContainer.classList.add("kambaModalContainer");
                    kambaModalContainer.style.width = '100vw';
                    kambaModalContainer.style.height = '100%';
                    kambaModalContainer.style.background = 'rgba(0,0,0,.4)';
                    kambaModalContainer.style.position = 'fixed';
                    kambaModalContainer.style.top = '0';
                    kambaModalContainer.style.left = '0';
                    kambaModalContainer.style.zIndex = '1000000000000000000000';
                    kambaModalContainer.style.display = 'flex';
                    kambaModalContainer.style.justifyContent = 'center';
                    kambaModalContainer.style.alignItems = 'center';
                    kambaModalContainer.style.boxSizing = 'border-box';
                    kambaModalContainer.style.paddingRight = '1rem';
                    kambaModalContainer.style.overflow = 'auto';
                    kambaModalContainer.style.cursor = 'pointer';

                    kambaModalContainer.addEventListener('click', function(){
                    kambaModalContainer.style.display = 'none';
                    });

                    //Button for Pay Kamba
                    document.querySelector(".btnOpenWidgetKamba").onclick = function(){
                        kambaModalContainer.style.display = 'flex';
                    };

                    //Template
                    const kambaWidget = `

                    <div class="kambaModalWidget">
                        <section> 
                                <p class="textErrorKamba"></p>
                        </section>
                    </div>`
                    kambaModalContainer.innerHTML = kambaWidget;

                    //Style Widget Modal
                    var kambaModalWidget = document.querySelector("main .kambaModalWidget");
                    kambaModalWidget.style.borderRadius = '0.2rem';
                    kambaModalWidget.style.overflow = 'auto';
                    kambaModalWidget.style.background = '#fff';
                    kambaModalWidget.style.width = '40%';
                    kambaModalWidget.style.height = '30%';
                    kambaModalWidget.style.position = 'absolute';
                    kambaModalWidget.style.fontFamily = "'Montserrat', sans-serif";
                    kambaModalWidget.style.fontSize = '0.95rem';
                    kambaModalWidget.style.boxShadow = '0 5px 8px 0 rgba(0,0,0,.2), 0 7px 20px 0 rgba(0,0,0,.10)';
                    kambaModalWidget.style.display = 'flex';
                    kambaModalWidget.style.justifyContent = 'center';
                    kambaModalWidget.style.alignItems = 'center';
                    kambaModalWidget.style.boxSizing = 'border-box';
                    kambaModalWidget.style.padding = '1rem';
                    kambaModalWidget.style.color = 'red';
                
               }             

            })  
        }
    })();
})();








