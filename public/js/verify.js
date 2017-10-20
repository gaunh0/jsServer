/**
 * Created by nttuan on 15/05/2017.
 */

var url = window.location.href;

var account = url.substring(url.indexOf('/verify/') + 8, url.lastIndexOf('/'));
var key = url.substring(url.lastIndexOf('/') + 1);

var i = 0;

var info = setInterval(function () {
  i++;
  if (i === 1) {
    $('.info').html('Verifying your account, please waiting ');
  }
  else if (i === 2) {
    $('.info').html('Verifying your account, please waiting .');
  }
  else if (i === 3) {
    $('.info').html('Verifying your account, please waiting ..');
  }
  else if (i === 4) {
    i = 0;
    $('.info').html('Verifying your account, please waiting ...');
  }
},300);

$.ajax({
  method: 'POST',
  url: '/user/verify',
  data: {
    account: account,
    verifyKey: key
  }
})
  .done(function (data) {
    console.log(data);
    if (data.status) {
      setTimeout(function () {
        $('.info').html('Your account was verified successfully');
        clearInterval(info);
      }, 3000);
    }
    else {
      setTimeout(function () {
        $('.info').html('Failed when verifying your account');
        clearInterval(info);
      }, 3000);
    }
  });
