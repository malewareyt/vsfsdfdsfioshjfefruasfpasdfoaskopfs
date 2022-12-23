if (window.location.host == "docs.synapse.to") {
    window.location.href = "https://x.synapse.to/docs";
}

function onSubmit(token) {
    document.getElementById("dlform").submit();
}
const enableBrainTree = false;
const licenseUri = 'https://docs.google.com/document/d/e/2PACX-1vRaYQ4Aru274AFrJ2uXm0AraqEXt_8jGzcrm7_58g7gn6b1DWi3QKHRABYDtR6aFFZbDb6-K1szb1Mc/pub';
const paymentBox = document.getElementById('payments');
const paymentBtn = document.getElementById('payment-btn');
const paymentButtons = document.querySelectorAll('.payment-method');
const paymentBtcBtn = document.querySelector('.payment-btc');
const cardContainer = document.getElementById('dropin-container');
const siteCardWrapper = document.querySelector('#site-pay-card-wrapper');
const siteCardSubmit = document.querySelector('#pay-card-btn');
const siteCryptoCancel = document.querySelector('#pay-cancel-crypto');
const siteCardCancel = document.querySelector('#pay-cancel-card');
siteCardCancel ? .addEventListener('click', () => siteCardWrapper.classList.remove('show-card'));
siteCryptoCancel ? .addEventListener('click', () => siteCardWrapper.classList.remove('show-crypto'));
if (enableBrainTree) {
    const purchaseBraintreeProcedure = async () => {
        siteCardWrapper.classList.add('show-card');
        let resolvePromise;
        const purchaseTokenRequest = new XMLHttpRequest();
        purchaseTokenRequest.onload = () => resolvePromise(purchaseTokenRequest.responseText);
        purchaseTokenRequest.open('GET', 'https://localhost:7076/purchase/token');
        const purchaseToken = await new Promise(resolve => {
            resolvePromise = resolve;
            purchaseTokenRequest.send();
        });
        console.log(`Got purchase token ${purchaseToken}`);
        braintree.dropin.create({
            authorization: 'sandbox_rzkpwmvx_jz5ybtdbf68b598r',
            container: cardContainer,
            card: {
                cardholderName: true
            },
            paypal: {
                flow: "checkout",
                amount: 20,
                currency: 'USD',
                commit: true
            },
            venmo: {},
            applePay: {
                displayName: 'Synapse Softworks LLC',
            },
            googlePay: {}
        }, (error, dropinInstance) => {
            if (error) {
                cardContainer.innerHTML = error;
                return;
            }
            siteCardSubmit.addEventListener('click', async () => {
                try {
                    dropinInstance.requestPaymentMethod(async (error, payload) => {
                        console.log(error, payload);
                        const purchaseFormData = new FormData();
                        purchaseFormData.append('paymentMethodNonce', payload.nonce);
                        console.log(`Payment nonce: ${payload.nonce}`);
                        let purchaseResolvePromise;
                        const purchaseRequest = new XMLHttpRequest();
                        purchaseRequest.onload = () => purchaseResolvePromise(purchaseRequest.responseText);
                        purchaseRequest.open('POST', 'https://localhost:7076/purchase/create');
                        const purchaseResult = await new Promise(resolve => {
                            purchaseResolvePromise = resolve;
                            purchaseRequest.send(purchaseFormData);
                        });
                        console.log(purchaseResult);
                        dropinInstance.teardown(err => {
                            if (err) {
                                console.error(err);
                            }
                        });
                    });
                } catch (FUCK) {
                    console.warn(FUCK);
                }
            });
        });
    };
    const purchaseCryptoProcedure = async () => {
        siteCardWrapper.classList.add('show-crypto');
    };
    paymentButtons.forEach(payBtn => payBtn.addEventListener('click', () => purchaseBraintreeProcedure()));
    paymentBtcBtn.addEventListener('click', () => purchaseCryptoProcedure());
} else {
    document.getElementById('site-pay-notice-btn').addEventListener('click', () => {
        window.open(licenseUri, '_blank');
        const blackout = document.getElementById('blackout');
        blackout ? .parentNode.removeChild(blackout);
    });
    document.getElementById('pay-close') ? .addEventListener('click', () => {
        document.getElementById('site-pay-wrapper') ? .classList.remove('show');
    });
}
paymentBtn ? .addEventListener('click', () => {
    if (enableBrainTree) {
        paymentBox.style.transform = 'scale(1)';
        paymentBtn.style.transform = 'scale(0)';
    } else {
        document.getElementById('site-pay-wrapper') ? .classList.add('show');
    }
});
const firstSection = document.getElementById('FIRST');
const qaSection = document.getElementById('QA');
document.getElementById('scroll') ? .addEventListener('click', () => firstSection.scrollIntoView());
document.getElementById('qaButton') ? .addEventListener('click', () => qaSection.scrollIntoView());
document.getElementById('pay-with-pp') ? .addEventListener('click', () => {
    document.getElementById('pp-form') ? .submit();
})
document.getElementById('pay-with-crypto') ? .addEventListener('click', () => {
    document.getElementById('coin-form') ? .submit();
})