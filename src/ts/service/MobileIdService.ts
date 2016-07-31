class MobileIdService {

    private static MOBILE_ID_SERVICE_URL = 'http://54.194.233.151:8080/v1/';
    //private static MOBILE_ID_SERVICE_URL = 'http://172.31.36.178:8080/v1/';

    public register(address, phoneNumber, cb) {
        Utils.log(`MobileId registration for address ${address} and phone ${phoneNumber} initiated`);

        Utils.xhr(MobileIdService.MOBILE_ID_SERVICE_URL + 'authenticate', JSON.stringify({
            accountAddress: address,
            phoneNumber: phoneNumber
        }), (res)=> {
            console.log(res);
            var data = JSON.parse(res);
            var code = data.challengeCode;
            Utils.log(`Received mobileId confirmation code <b>${code}</b>`);
            this.pollStatus(data.authIdentifier, cb);
        }, 'POST')
    }

    private pollStatus(id, cb) {
        this.poll(id, (res)=> {
            console.log(res);
            var status = JSON.parse(res).status;

            Utils.log(`Check mobileId auth status ${status}`);
            switch (status) {
                case 'LOGIN_SUCCESS':
                    Utils.log(`MobileId auth success!`);
                    cb();
                    break;
                case 'LOGIN_EXPIRED':
                case 'LOGIN_FAILURE':
                    Utils.log(`MobileId auth process broken, need to restart process`); //additioanl action required to prevent loops
                    break;
                default:
                    setTimeout(this.pollStatus.bind(this, id, cb), 3000);
                    break;
            }
        });
    }

    private poll(id, cb) {
        Utils.xhr(MobileIdService.MOBILE_ID_SERVICE_URL + 'poll', JSON.stringify({authIdentifier: id}), cb, 'POST');
    }
}