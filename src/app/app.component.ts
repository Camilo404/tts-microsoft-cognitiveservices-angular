import { Component, OnInit } from '@angular/core';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'Text To Speech Microsoft Cognitive Services';

  private speechConfig = SpeechSDK.SpeechConfig.fromSubscription('yoursubscriptionkey', 'region(eastus)');
  private speechSynthesizer = new SpeechSDK.SpeechSynthesizer(this.speechConfig);

  public spanishVoices: any;
  public selectedVoice: string = '';
  private selectedVoiceSsml: string = '';
  private selectedVoiceLang: string = '';
  public pitch = 0;
  public rate = 0;

  public textToSpeech: string = '';

  constructor() { }

  ngOnInit() {
    this.getVoices();
  }

  private getVoices() {
    let voicesList = this.speechSynthesizer.getVoicesAsync();
    voicesList.then((result) => {
      this.spanishVoices = result.voices.filter((voice) => voice.locale.startsWith('es'));
      // console.log(this.spanishVoices);

      // this.spanishVoices.forEach((voice: { localName: string; locale: string; gender: number; }) => {
      //   console.log(voice.localName + ' ' + voice.locale + ' ' + voice.gender);
      // });
    }, (error) => {
      console.log(error);
    });
  }

  public selectVoice(voice: any) {
    let voiceSelected = voice.target.value;

    if (voiceSelected === 'default') {
      alert('Por favor, seleccione una voz.');

      this.selectedVoice = '';
      this.selectedVoiceSsml = '';
      this.selectedVoiceLang = '';
    }

    let selectedVoice = this.spanishVoices.find((voice: { shortName: string; }) => voice.shortName === voiceSelected);
    // console.log(selectedVoice);

    this.selectedVoice = selectedVoice.localName;
    this.selectedVoiceSsml = selectedVoice.shortName;
    this.selectedVoiceLang = selectedVoice.locale;
    // console.log(this.selectedVoice);
    // console.log(this.selectedVoiceSsml);
    // console.log(this.selectedVoiceLang);
  }

  public speakText() {
    if (this.selectedVoice === '') alert('Por favor, seleccione una voz.');
    if (this.textToSpeech === '') alert('Por favor, ingrese un texto.');

    this.speechSynthesizer = new SpeechSDK.SpeechSynthesizer(this.speechConfig);

    let ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">' +
      '<voice name="' + this.selectedVoiceSsml + '">' +
      '<lang xml:lang="' + this.selectedVoiceLang + '"> ' +
      '<prosody rate="' + this.rate + '%' + '" pitch="' + this.pitch + '%' + '">' +
      this.textToSpeech +
      '</prosody>' +
      '</lang>' +
      '</voice>' +
      '</speak>';

    this.speechSynthesizer.speakSsmlAsync(ssml, (result) => {
      console.log(result);
    }, (error) => {
      console.log(error);
    });
  }
}
