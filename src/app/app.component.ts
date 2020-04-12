import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as SIP from '../../node_modules/sip.js/dist/sip.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'sipjs';

  username = 'mitsuo';
  wssServer = 'fsws.pinyata.app';
  wssPort = 7443;
  sipServer = 'pbx.pinyata.app';
  regPassword = 'default_password';
  state = 'No';

  callId = 303;
  callStatus = 'None';

  config = {
    uri: `${this.username}@${this.sipServer}`,
    transportOptions: {
      wsServers: [`wss://${this.wssServer}:7443`],
    },
    authorizationUser: this.username,
    password: 'default_password',
    // hackCleanJitsiSdpImageattr: true,
  };

  callNum = `${this.callId}@${this.sipServer}`;

  ua: SIP.UA;
  simple: SIP.Web.Simple;
  session: any;

  registering = false;
  registered = false;
  onCall = false;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    // this.Simple();
    // this.SipJs2();

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

  ngOnDestroy() {
    this.session.terminate();
  }

  /****************** SIPJS v2 ************************/
  SipJs2() {
    this.state = 'No';
    this.UpdateConfig();
    this.registering = true;
    this.registered = false;
    this.ua = new SIP.UA(this.config);

    this.ua.on('registered', () => {
      this.state = 'Yes';
      this.registering = false;
      this.registered = true;
    });
    this.ua.on('registrationFailed', () => {
      this.state = 'Failed';
      this.registering = false;
    });

    // this.ua.on('failed', function (e) {
    //   alert('call failed: ' + e.cause);
    // });
    // this.ua.on('accepted', function (e) {
    //   // Attach local stream to selfView
    // });
    // this.ua.on('addstream', function (e) {
    //   // Attach remote stream to remoteView
    // });
  }

  call() {
    this.onCall = false;
    this.callStatus = 'Calling...';
    var remoteAudio = <HTMLAudioElement>document.getElementById('remoteAudio');
    var localAudio = <HTMLAudioElement>document.getElementById('localAudio');

    if (this.ua.isRegistered()) {
      var options = {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: false
          }
        }
      };
      this.session = this.ua.invite(this.callNum, options);
      // this.ua.on('invite', () => {
      //   // Recieve call
      // });

      this.session.on('trackAdded', () => {
        this.onCall = true;;
        let pc = this.session.sessionDescriptionHandler.peerConnection;

        var remoteStream = new MediaStream();
        pc.getReceivers().forEach(receiver => {
          remoteStream.addTrack(receiver.track);
        });
        console.log(`\n\n\nRemoteStream: ${remoteStream}\n\n\n`)
        remoteAudio.srcObject = remoteStream;
        remoteAudio.play();
        this.callStatus = "On Call";

        // Gets local tracks
        var localStream = new MediaStream();
        pc.getSenders().forEach(sender => {
          localStream.addTrack(sender.track);
        });
        localAudio.srcObject = localStream;
        // localAudio.play();
      });
    }

    // console.log('\n\n\n\asdfasdfasdf\n\n\n', this.ua);
  }

  HangUp() {
    this.session.terminate();
  }

  UpdateConfig() {
    this.config = {
      uri: `${this.username}@${this.sipServer}`,
      transportOptions: {
        wsServers: [`wss://${this.wssServer}:${this.wssPort}`],
      },
      authorizationUser: this.username,
      password: this.regPassword,
      // hackCleanJitsiSdpImageattr: true,
    };
  }

  // Simple() {
  //   this.ua = new SIP.UA(this.config);
  //   var state = <HTMLInputElement>document.getElementById('state');

  //   this.ua.on('registered', () => {
  //     state.value = 'yes';
  //     var options = {
  //       RTCConstraints: {
  //         offerToReceiveAudio: true,
  //         offerToReceiveVideo: false
  //       },
  //       media: {
  //         local: { audio: document.getElementById('localAudio') },
  //         remote: { audio: document.getElementById('remoteAudio') }
  //       },
  //       ua: this.ua
  //     };
  //     this.simple = new SIP.Web.Simple(options);

  //     console.log('\n\n\nconfig\n\n\n', this.simple.state);
  //     this.ua.on('new', () => {
  //       console.log('FAILED REGISTRATION');
  //     });
  //   });
  // }

  // SimpleCall() {
  //   console.log(`\n\n\n${this.simple.on}\n\n\n`);
  //   this.simple.call(this.callNum);
  // }

}
