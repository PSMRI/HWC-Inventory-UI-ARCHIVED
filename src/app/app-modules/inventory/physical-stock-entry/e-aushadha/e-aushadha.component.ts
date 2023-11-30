import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services/confirmation.service';
import { LanguageService } from 'app/app-modules/core/services/language.service';
import { InventoryService } from '../../shared/service/inventory.service';

@Component({
  selector: 'app-e-aushadha',
  templateUrl: './e-aushadha.component.html',
  styleUrls: ['./e-aushadha.component.css'],
  providers:[DatePipe]
})
export class EAushadhaComponent implements OnInit {
  eAushadhaForm: FormGroup;
  currentLanguageSet: any;
  languageComponent: SetLanguageComponent;
  facilityID: any;
  today: Date;
  isPopupOpen: boolean = false;
  failedRecordsArray: any[] = [];
  failedRecordsFlag :boolean = false;
  showProgressBar: boolean = false;
  inwardDate: any;

  constructor( private fb: FormBuilder,
    private datePipe: DatePipe,
    private http_service: LanguageService,
    private dialogService: ConfirmationService,
    private inventoryService: InventoryService) { }

  ngOnInit() {
    this.facilityID = localStorage.getItem('facilityID')
    this.eAushadhaForm = this.createeAushadhaForm();
    this.today = new Date();
    if(this.failedRecordsArray === null || this.failedRecordsArray === undefined || this.failedRecordsArray.length === 0){
      this.failedRecordsFlag = false;
    }
  }
  ngDoCheck(){
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.http_service);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject; 
  }
  
  createeAushadhaForm() {
    return this.fb.group({
      eAushadhaDateField: null
    });
    
  }

  geteAushadhaDate(){
    this.failedRecordsFlag = false;
    let formDate = this.eAushadhaForm.controls["eAushadhaDateField"].value;
    let inwardDate = this.datePipe.transform(formDate, 'yyyy-MM-dd')
    this.showProgressBar = true;
    let reqObj = {
      "inwardDate" : inwardDate,
      "facilityId": this.facilityID
    }

    
    if(this.failedRecordsArray === null || this.failedRecordsArray === undefined || this.failedRecordsArray.length === 0){
      this.failedRecordsFlag = false;
    }

    this.inventoryService.saveEAusadha(reqObj)
      .subscribe(response => {
        if (response.statusCode == 200 && response.data ) {
          this.showProgressBar = false;
          this.dialogService.alert(response.data.response.response, 'success');
          this.reset();
          this.failedRecordsArray = response.data.failedStocks;
          if(this.failedRecordsArray.length>0){
            this.failedRecordsFlag = true;
          }
          else{
              this.failedRecordsFlag = false;
            }
        }
        else if (response.statusCode == 5000) {
          this.failedRecordsFlag = false;
          this.reset();
          this.dialogService.alert("Error while entering the stocks", 'error');
        }
      }, err => {
        this.reset();
        this.failedRecordsFlag = false;
        this.dialogService.alert(err, 'error');
      })
  }

  reset() {
    this.eAushadhaForm = this.createeAushadhaForm();
    this.today = new Date();
  }

  onInwardDateChange(){
    this.failedRecordsFlag = false;
  }

  }
