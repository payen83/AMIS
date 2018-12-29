import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-inspection',
  templateUrl: 'inspection.html',
})
export class InspectionPage {
  inspect: string;
  info: string;
  routine: { assetstatus: any, replace: boolean, plan: boolean, measurement: boolean, remark: string };

  assetinspect: {
    routine: any,
    asset_id: number,
    ins_id: number,
    rfid: number,
    ins_type: string,
    start_date: string,
    last_date: Date,
    process_loc: string,
    class: string,
    asset_type: string,
    images: {
      imageBefore: Array<any>,
      imageDuring: Array<any>,
      imageAfter: Array<any>
    }
  };

  // imageBefore: Array<any>;
  // imageDuring: Array<any>;
  // imageAfter: Array<any>;
  assetowningList: Array<any>;
  assetinspectList: Array<any>;
  assetinspectStatus: Array<any>;
  // ins_id: any = 0;
  id: any = 0;
  type: any;
  index: number;
  pending: any;
  title: string;


  constructor(public alertCtrl: AlertController, public storage: Storage, public modal: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.routine = { assetstatus: null, replace: false, plan: false, measurement: false, remark: null }
    // this.assetinspect = {
    //   asset_id: null,
    //   ins_id: null,
    //   rfid: null,
    //   ins_type: null,
    //   start_date: null,
    //   last_date: null,
    //   process_loc: null,
    //   class: null,
    //   asset_type: null,
    //   routine: null,
    //   images: {
    //     imageBefore: [],
    //     imageDuring: [],
    //     imageAfter: []
    //   }
    // };
    // this.imageList = [];

    let data = this.navParams.get('params');
    this.type = this.navParams.get('type');
    this.index = this.navParams.get('index');
    console.log('data');
    console.log(data);

    if (this.type == 'edit') {
      this.assetinspect = data;
      this.title = 'Edit Inspection'
      this.routine = this.assetinspect.routine;
    } else {
      this.title = 'Asset Inspection';
      let _date = new Date();
      this.id = String(_date.getTime()) + '-' + data.id;
      let month = _date.getMonth() + 1;
      let day = _date.getDay();
      let year = _date.getFullYear();

      this.assetinspect = {
        asset_id: data.id,
        ins_id: this.id,
        rfid: null,
        ins_type: null,
        start_date: day + '/' + month + '/' + year,
        last_date: null,
        process_loc: data.process_loc,
        class: data.class,
        asset_type: data.asset_type,
        routine: null,
        images: {
          imageBefore: [],
          imageDuring: [],
          imageAfter: []
        }
      };
    }

    this.assetinspectStatus = [
      { id: "01", name: "Good" },
      { id: "02", name: "Repair" }
    ]

    this.storage.get('ASSETINSPECT_LIST').then((val) => {
      console.log(val);
      if (val) {
        this.assetinspectList = JSON.parse(val);
      } else {
        this.assetinspectList = [];
      }
    })
  }

  saveAsset() {
    //this.storage.set("id", this.id);
    this.assetinspect.routine = this.routine;
    if (this.type == 'edit') {
      this.assetinspectList[this.index] = this.assetinspect;


    } else {
      this.assetinspectList.push(this.assetinspect);
      console.log(this.assetinspectList);

    }
    this.storage.set('ASSETINSPECT_LIST', JSON.stringify(this.assetinspectList));
    this.showAlert();
    this.goToPendingPage();

  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'The inspection is saved successfully',
      buttons: ['OK']
    });
    alert.present();
  }

  goToPendingPage() {
    this.navCtrl.setRoot('PendingPage', {type: 'inspect'});
  }

  showImage2(pic: string) {
    return 'data:image/jpeg;base64,' + pic;
  }

  openModal(imageType: string) {
    let id: number = this.setId(imageType);

    let params = {
      type: 'new',
      id: id
    }
    const myModal = this.modal.create('Camera2Page', { params: params }, { cssClass: 'camera2-modal', enableBackdropDismiss: false })
    myModal.onDidDismiss(data => {
      if (data) {
        // alert(JSON.stringify(data));
        if (imageType == 'before') {
          this.assetinspect.images.imageBefore.push(data);
        } else if (imageType == 'during') {
          this.assetinspect.images.imageDuring.push(data);
        } else if (imageType == 'after') {
          this.assetinspect.images.imageAfter.push(data);
        }
      }
    })
    myModal.present();
  }

  setId(imageType: string) {
    if (imageType == 'before') {
      return Number(this.assetinspect.images.imageBefore.length) + 1;
    } else if (imageType == 'during') {
      return Number(this.assetinspect.images.imageBefore.length) + 1;
    } else if (imageType == 'after') {
      return Number(this.assetinspect.images.imageBefore.length) + 1;
    }
  }


  ionViewDidLoad() {
    this.inspect = "general-info";
  }

}
