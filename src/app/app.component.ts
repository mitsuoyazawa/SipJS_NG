import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as SIP from '../../node_modules/sip.js/dist/sip.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {

  title = 'sipjs';
  config = {
    uri: 'mitsuo@pbx.pinyata.app',
    transportOptions: {
      wsServers: ['wss://fsws.pinyata.app:7443'],
    },
    authorizationUser: 'mitsuo',
    password: 'default_password',
    // hackCleanJitsiSdpImageattr: true,
  };

  callNum = '303@pbx.pinyata.app';

  ua: SIP.UA;
  simple: SIP.Web.Simple;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    // this.Simple();
    this.SipJs2();


    // ***************** SIPJS
    // var session = new SIP.UA(this.config);
    // session.invite('303@pbx.pinyata.app');
    // var remote = <HTMLAudioElement>document.getElementById('remoteAudio');

    // session.on('trackAdded', function () {
    //   console.log('session on***********************************************');
    //   var pc = session.sessionDescriptionHandler.peerConnection;
    //   var remoteStream = new MediaStream();
    //   pc.getReceivers().forEach(receiver => {
    //     remoteStream.addTrack(receiver.track);
    //   });
    //   remote.srcObject = remoteStream;
    //   remote.play();
    // })
  }

  SipJs2() {
    /****************** SIPJS v2 ************************/
    var state = <HTMLInputElement>document.getElementById('state');
    var remoteAudio = <HTMLAudioElement>document.getElementById('remoteAudio');
    var localAudio = <HTMLAudioElement>document.getElementById('localAudio');

    this.ua = new SIP.UA(this.config);

    this.ua.on('registered', function () {
      state.value = 'Yes';
    });


    this.ua.on('failed', function (e) {
      alert('call failed: ' + e.cause);
    });
    this.ua.on('accepted', function (e) {
      // Attach local stream to selfView
      console.log("\n\n\n\naccepted\n\n\n\n");
    });
    this.ua.on('addstream', function (e) {
      // Attach remote stream to remoteView
      console.log("\n\n\n\nadd stream\n\n\n")
    });
  }

  call() {
    console.log("calling");
    if (this.ua.isRegistered()) {
      var options = {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: false
          }
        }
      };
      this.ua.invite(this.callNum, options);
      this.ua.on('invite', () => {
        console.log('\n\n\nINVITE BACK? WTF\n\n\n');
      });
    }
    console.log('\n\n\n\asdfasdfasdf\n\n\n', this.ua);
  }

  Simple() {
    this.ua = new SIP.UA(this.config);
    var state = <HTMLInputElement>document.getElementById('state');

    this.ua.on('registered', () => {
      state.value = 'yes';
      var options = {
        RTCConstraints: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: false
        },
        media: {
          local: { audio: document.getElementById('localAudio') },
          remote: { audio: document.getElementById('remoteAudio') }
        },
        ua: this.ua
      };
      this.simple = new SIP.Web.Simple(options);

      console.log('\n\n\nconfig\n\n\n', this.simple.state);
      this.ua.on('new', () => {
        console.log('FAILED REGISTRATION');
      });
    });
  }

  SimpleCall() {
    console.log(`\n\n\n${this.simple.on}\n\n\n`);
    this.simple.call(this.callNum);
  }

}
