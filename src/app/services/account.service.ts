import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable, forkJoin, map } from 'rxjs';

import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  encryptionKey = environment.encryptionKey;

  list_StoredAds: any = [];

  list_StoredCity: any = [];

  list_StoredCity_By_Image: any = [];

  list_StoredNews: any = [];

  list_StoredCategory: any = [];

  list_StoredCurrency: string = '';

  list_StoredCondition: any = [];

  list_Stored_CityList4Support: any = [];

  list_Stored_groups: any = [];

  list_Stored_groupsSamsari: any = [];

  list_Stored_groupsEmploy: any = [];

  tiType_Stored: number;

  bDateJalali_Stored: boolean | null = null;

  constructor(private http: HttpClient) {}

  // login_SSO(model: any) {
  //   return this.http.post(environment.baseUrl + 'App_LoginBySSO', model);
  // }

  // Geocoding(model: any) {
  //   return this.http.post(environment.baseUrl + 'Dyar_Geocoding', model);
  // }
  // SaveMC_Message(model: any) {
  //   return this.http.post(
  //     environment.baseUrl + 'MC_Public_SaveMC_Message',
  //     model
  //   );
  // }

  // serviceType(model: any) {
  //   return this.http.post(
  //     environment.baseUrl +
  //       `SearchServiceCenterByTypeAndName?iUserManager_User=${
  //         model.Id
  //       }&strSession=${model.session}&iServiceCenterType=${
  //         model.ServiceType
  //       }&strName=${''}&fLat=${0}&fLon=${0}`,
  //     {}
  //   );
  // }

  // ServiceCenterType() {
  //   return this.http.post(environment.baseUrl + 'ServiceCenterType', {});
  // }
  // SearchServiceCenterByTypeAndName(params) {
  //   return this.http.post(
  //     environment.baseUrl + 'SearchServiceCenterByTypeAndName',
  //     {},
  //     { params: params }
  //   );
  // }
  // GetDomain(model) {
  //   return this.http.post(environment.baseUrl + `GetDomain`, model);
  // }
  // GetAttractionType(model) {
  //   return this.http.post(environment.baseUrl + `GetAttractionType`, model);
  // }
  // GetUserCartable(model) {
  //   return this.http.post(environment.baseUrl + `GetUserCartable`, model);
  // }
  // GetEducationalContent(model, session) {
  //   return this.http.post(environment.baseUrl + `GetEducationalContent?strSession=${session}`, model);
  // }
  // GetAllDefectType(model: any) {
  //   return this.http.post(environment.baseUrl + `GetAllDefectType`, model);
  // }
  // UpdateUserCartableVissted(model, id, session) {
  //   return this.http.post(environment.baseUrl + `UpdateUserCartableVissted?iUserManager_User=${id}&strSession=${session}`, model);
  // }
  // GetReqestImportance(model) {
  //   return this.http.post(environment.baseUrl + `GetReqestImportance`, model);
  // }
  // DeleteUserCartable(model) {
  //   return this.http.post(environment.baseUrl + `DeleteUserCartable`, model);
  // }
  // GetActiveManagers(model) {
  //   return this.http.post(environment.baseUrl + `MC_Public_GetActiveManagers`, model);
  // }
  // GetCitizenMessage(model) {
  //   return this.http.post(environment.baseUrl + `MC_Public_GetCitizenMessage`, model);
  // }
  // GetWelcome2Room(model) {
  //   return this.http.post(environment.baseUrl + `MC_Public_GetWelcome2Room`, model);
  // }
  // GetDefectType(model, id) {
  //   return this.http.post(environment.baseUrl + `GetDefectType?iDomain=${id}`, model);
  // }
  // Public_FAQ(id) {
  //   return this.http.post(environment.baseUrl + `Public_FAQ?strCityCode=${id}`, {});
  // }
  // getAttractionGallery(model, id, session) {
  //   return this.http.post(environment.baseUrl + `GetAttractionGallery?iUserManager_User=${id}&strSession=${session}`, model);
  // }
  // SaveUserReqest(model) {

  //   // return this.http.post(environment.baseUrl + `SaveUserReqest?iUserManager_User=${id}&strSession=${session}`, model);
  //   return this.http.post(environment.baseUrl + 'SaveUserReqestNew', model)
  // }

  // GetUserAttractionScore(model, id, session) {
  //   return this.http.post(environment.baseUrl + `GetUserAttractionScore?iUserManager_User=${id}&strSession=${session}`, model);
  // }
  // SetAttractionScore(model, id, session) {
  //   return this.http.post(environment.baseUrl + `SetAttractionScore?iUserManager_User=${id}&strSession=${session}`, model);
  // }
  // GetAttractionBalog(model, id, session) {
  //   return this.http.post(environment.baseUrl + `GetAttractionBalog?iUserManager_User=${id}&strSession=${session}`, model);
  // }
  // DeleteUserReqest(model) {
  //   // return this.http.post(environment.baseUrl + `DeleteUserReqest?iUserManager_User=${id}&strSession=${session}`, model);

  //   return this.http.post(environment.baseUrl + `DeleteUserReqestNew`, model)

  // }
  // SaveAttractionBalog(model) {

  //   // return this.http.post(environment.baseUrl + `SaveAttractionBalog?&strSession=${session}`, model);

  //   return this.http.post(environment.baseUrl + `SaveAttractionBalogNew`, model)
  // }
  // GetAttractionScore(Id) {

  //   return this.http.post(environment.baseUrl + `GetAttractionScore?&iAttraction=${Id}`, {});
  // }

  // GetBasicTravel(model) {

  //   return this.http.post(environment.baseUrl + `GetAttractionListNew`, model);

  // }

  // GetApplicationForms(model) {

  //   return this.http.post(environment.baseUrl + `GetApplicationForms`, model);
  // }
  // getFormGroup(model) {

  //   return this.http.post(environment.baseUrl + `Form_GetFormGroup`, model);
  // }

  // getSpeceficFormData(model) {

  //   return this.http.post(environment.baseUrl + `Form_GetForms`, model);

  // }
  // getFormItems(model) {

  //   return this.http.post(environment.baseUrl + `Form_GetFormItems`, model);

  // }

  // savePooyaFormItems(info, forms) {

  //   return this.http.post(environment.baseUrl + `Form_SaveForm`, {

  //     iUserManager_User: info.iUserManager_User,

  //     strSession: info.strSession,

  //     iForms: info.iForms,

  //     fLat: info.fLat,

  //     fLon: info.fLon,

  //     mdlFormItem: forms

  //   });

  // }

  // SubmitedPooyaForms(model) {

  //   return this.http.post(environment.baseUrl + `Form_GetAllFormValue`, model);

  // }

  // SubmitedPooyaItems(model) {

  //   return this.http.post(environment.baseUrl + `Form_GetFormItemValue`, model);

  // }
  // formLastActions(model) {

  //   return this.http.post(environment.baseUrl + `Form_GetFormProceedings`, model);

  // }

  // citizenInfo(model) {
  //   return this.http.post(environment.baseUrl + `GetCitizenCredit`, model);
  // }

  // getFavoritePlaces(model) {
  //   return this.http.post(environment.baseUrl + `ServiceCenterTypeNew`, model);
  // }

  // SitesAndApplication(CityCode) {
  //   return this.http.post(environment.baseUrl + `SitesAndApplication?strCityCode=${CityCode}`, {});
  // }
  // GetUserApplicationForms(model) {
  //   return this.http.post(environment.baseUrl + `GetUserApplicationForms`, model);
  // }
  // DeleteUserApplicationForm(model) {
  //   return this.http.post(environment.baseUrl + `DeleteUserApplicationForm`, model);
  // }

  // deletePoyaForm(model) {
  //   return this.http.post(environment.baseUrl + `Form_DeleteForm`, model);
  // }
  // GetUserApplicationForm(model) {
  //   return this.http.post(environment.baseUrl + `GetUserApplicationForm`, model);
  // }
  // SaveUserApplicationForm(model, session) {
  //   return this.http.post(environment.baseUrl + `SaveUserApplicationForm?strSession=${session}`, model);
  // }
  // GetApplicationForm(Id) {
  //   return this.http.post(environment.baseUrl + `GetApplicationForm?iApplicationForms=${Id}`, {});
  // }

  // GetAttractionList4Search(model) {
  //   // return this.http.post(environment.baseUrl + `GetAttractionList4Search?strSateCode=${strSateCode}&tiAttractionType=${tiAttractionType}&strCityCode=${strCityCode}&strVillageCode=${strVillageCode}&iUserManager_User=${Id}&strSession=${session}`, {});

  //   return this.http.post(environment.baseUrl + `GetAttractionList4SearchNew`, model)

  // }

  // GetUserReqests(Id, session) {
  //   // return this.http.post(environment.baseUrl + `GetUserReqests?iUserManager_User=${Id}&strSession=${session}`, {});

  //   return this.http.post(environment.baseUrl + 'GetUserReqestsNew', {

  //     iUserManager_User: Id,
  //     strSession: session

  //   })
  // }
  // GetUserReqest(Id, session, req) {
  //   return this.http.post(environment.baseUrl + `GetUserReqest?iUserManager_User=${Id}&strSession=${session}&iUserReqest=${req}`, {});
  // }

  // getUserChat(model) {
  //   return this.http.post(environment.baseUrl + `UserRquestMessage_Get`, model);
  // }

  // conversation_deleteMessage(model) {
  //   return this.http.post(environment.baseUrl + `UserRquestMessage_Delete`, model)
  // }

  // mailList(model) {

  //   return this.http.post(environment.baseUrl + `OfficialLetter_List`, model);

  // }
  // letterTempList(model) {

  //   return this.http.post(environment.baseUrl + `OffitialLetther_Template`, model);

  // }
  // mailSave(model) {

  //   return this.http.post(environment.baseUrl + `OfficialLetter_Save`, model);

  // }
  // mailEdit(model) {

  //   return this.http.post(environment.baseUrl + `OfficialLetter_Edit`, model);

  // }
  // mailDelete(model) {

  //   return this.http.post(environment.baseUrl + `OfficialLetter_Delete`, model);

  // }
  // pastActions(model) {

  //   return this.http.post(environment.baseUrl + `OfficialLetter_Proceeding_List4Me`, model);

  // }
  // LetterPicPDF(model) {

  //   return this.http.post(environment.baseUrl + `OfficialLetter_GetSignLetterResponse`, model);

  // }
  // updateCV(model) {

  //   return this.http.post(environment.baseUrl + `Citizen_UpdateCV`, model);

  // }
  // otherPOI(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_Other`, model);

  // }
  // savedPOI(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_Saved4MeList`, model);

  // }
  // myPOI(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_My`, model);

  // }
  // deleteMyPOI(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_Delete`, model);

  // }
  // deleteMyPOIComment(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_DeleteComment`, model);

  // }
  // deleteCivilComment(model) {

  //   return this.http.post(environment.baseUrl + `CivilProjects_DeleteComment`, model);

  // }
  // spamCivilComment(model) {

  //   return this.http.post(environment.baseUrl + `CivilProjects_Spam`, model);

  // }
  // spamOtherPOIComment(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_Spam`, model);

  // }
  // editMyPOI(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_Edit`, model);

  // }
  // MyPOI_Info(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_Info`, model);

  // }
  // saveNewComment(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_SaveComment`, model);

  // }
  // likePOI(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_LikeDisLike`, model);

  // }
  // getGeneralInfoList(model) {

  //   return this.http.post(environment.baseUrl + `GeneralInfo_ListNew`, model);

  // }
  // likeCivil(model) {

  //   return this.http.post(environment.baseUrl + `CivilProjects_LikeDisLike`, model);

  // }
  // cmListCivil(model) {

  //   return this.http.post(environment.baseUrl + `CivilProjects_Comment_List`, model);

  // }
  // cmSaveCivil(model) {

  //   return this.http.post(environment.baseUrl + `CivilProjects_SaveComment`, model);

  // }
  // typePOI(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_Type`, model);

  // }
  // savePOI(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_Save`, model);

  // }
  // saveForMePOI(model) {

  //   return this.http.post(environment.baseUrl + `MyPOI_Save4Me`, model);

  // }

  // sendMessageChat(model) {
  //   return this.http.post(environment.baseUrl + `UserRquestMessage_Save`, model);
  // }

  // SaveUserReqestFeedback(model) {
  //   // return this.http.post(environment.baseUrl + `SaveUserReqestFeedback?iUserManager_User=${Id}&strSession=${session}&bConfirmation=${bConfirmation}`, model);

  //   return this.http.post(environment.baseUrl + `SaveUserReqestFeedbackNew`, model)
  // }
  // GetURL(Id) {

  //   return this.http.post(environment.baseUrl + `GetURL?iLinkType=${Id}`, {});
  // }
  // getHelp(model) {

  //   return this.http.post(environment.baseUrl + `Public_AppHelps`, model);
  // }

  // updateProfile(model, session) {
  //   return this.http.post(environment.baseUrl + `App_UpdateProfile?&strSession=${session}`, model);
  // }
  // InquiryDetailedPlan(model) {
  //   return this.http.post(environment.baseUrl + `InquiryDetailedPlan`, model);
  // }

  // InquiryRenovationDebt(model) {
  //   return this.http.post(environment.baseUrl + `InquiryRenovationDebt`, model);
  // }
  // GetEducation() {
  //   return this.http.post(environment.baseUrl + `GetEducation`, {});
  // }

  // ChangePassword(model) {
  //   return this.http.post(environment.baseUrl + `Public_ChangePassword`, model);
  // }

  // GetJournalList(model, session) {
  //   return this.http.post(environment.baseUrl + `GetJournalList?&strSession=${session}`, model);
  // }
  // GetJournalListRss(id) {
  //   return this.http.post(environment.baseUrl + `/GetJournalListNew?iJournalGroup=${id}`, {});
  // }
  // GetAllJournalGroup() {
  //   return this.http.post(environment.baseUrl + `/GetAllJournalGroup`, {});
  // }
  // GetListBusLine(model) {
  //   return this.http.post(environment.baseUrl + `Bus_ListBusLine`, model);
  // }
  // GetListBusStop(model) {
  //   return this.http.post(environment.baseUrl + `Bus_ListBusStop`, model);
  // }
  // civilProjectGallary(model) {
  //   return this.http.post(environment.baseUrl + `CivilProjects_Gallery_List4User`, model);
  // }
  // eventsGallary(model) {
  //   return this.http.post(environment.baseUrl + `GeneralInfo_Gallery4User_List`, model);
  // }

  // GetSpeceficBusLine(model) {

  //   return this.http.post(environment.baseUrl + 'Bus_ListBusLineStationNew', {

  //     iUserManager_User: model.iUserManager_User,

  //     strSession: model.strSession,

  //     iBusLine: model.iBusLine

  //   })
  // }
  // civilProjectsList(info, tiType) {
  //   // console.log(info);

  //   return this.http.post(environment.baseUrl + 'CivilProjects_List', {

  //     iUserManager_User: info.Id,

  //     strSession: info.session,

  //     tiType: tiType

  //   })

  // }
  // getGeneralInfo(info, tiGeneralInfoSubject) {

  //   return this.http.post(environment.baseUrl + 'GeneralInfo_List', {

  //     strCityCode: info.CityCode,

  //     strVillageCode: info.VilageCode,

  //     tiGeneralInfoSubject: tiGeneralInfoSubject

  //   })

  // }

  // getEssentialPhones() {
  //   return this.http.post(environment.baseUrl + `EssentialPhones_List`, {})
  // }

  // GetLastPositionofLine(model) {
  //   return this.http.post(environment.baseUrl + `Bus_GetLastPositionofLine`, model);
  // }
  // GetLastPositionofBus(model) {
  //   return this.http.post(environment.baseUrl + `Bus_GetLastPositionofBus`, model);
  // }
  // BusStopInfo(model) {
  //   return this.http.post(environment.baseUrl + `Bus_BusStopInfo`, model);
  // }
  // GetListBusLineStation(model) {
  //   return this.http.post(environment.baseUrl + `Bus_ListBusLineStation`, model);
  // }
  // UpdateJournalVissted(model, session) {
  //   return this.http.post(environment.baseUrl + `UpdateJournalVissted`, model, { params: session });
  // }
  // getUserRequests(parameters) {
  //   return this.http.post(environment.baseUrl + 'Organization_GetUserReqests', {
  //     iOrganizationalRole: parameters.iOrganizationalRole,
  //     iOrganizationalUser: parameters.iOrganizationalUser,
  //     strCityCode: parameters.strCityCode,
  //     strVillageCode: parameters.strVillageCode,
  //     strSession: parameters.strSession
  //   })
  // }

  // getPreviousOperations(user, session, userRequest) {
  //   const params = {
  //     iOrganizationalUser: user,
  //     strSession: session
  //   }
  //   return this.http.post(environment.baseUrl + 'Organization_GetProceedings', { iUserReqest: userRequest }, { params: params })
  // }

  // assignOperationToRequest(model, user, session) {
  //   const params = {
  //     iOrganizationalUser: user,
  //     strSession: session
  //   }
  //   return this.http.post(environment.baseUrl + 'Organization_App_SaveProceedings', {
  //     tiRequestStatus: model.status,
  //     iUserRequest: model.userRequest,
  //     fLat: "0",
  //     fLon: "0",
  //     strAnswer: model.comment,
  //     strImage: model.img
  //   }, { params: params })
  // }

  // myCarList(model) {
  //   return this.http.post(environment.baseUrl + `MyCar_My`, model);
  // }
  // myCarSave(model) {
  //   return this.http.post(environment.baseUrl + `MyCar_Save`, model);
  // }
  // getGpsList(model) {
  //   return this.http.post(environment.baseUrl + `GPS_List`, model);
  // }
  // myCarEdit(model) {
  //   return this.http.post(environment.baseUrl + `MyCar_Edit`, model);
  // }
  // myCarDel(model) {
  //   return this.http.post(environment.baseUrl + `MyCar_Delete`, model);
  // }
  // carWorkReport(model) {
  //   return this.http.post(environment.baseUrl + `MyCar_Function`, model);
  // }
  // voiceMessageList(model) {
  //   return this.http.post(environment.baseUrl + `ORGVoiceMessages_List`, model);
  // }
  // messageCommeentList(model) {
  //   return this.http.post(environment.baseUrl + `ORGVoiceMessages_CommentList`, model);
  // }
  // messageCommeentSave(model) {
  //   return this.http.post(environment.baseUrl + `ORGVoiceMessages_SaveComment`, model);
  // }
  // messageCommeentDelete(model) {
  //   return this.http.post(environment.baseUrl + `ORGVoiceMessages_DeleteComment`, model);
  // }
  // messageCommeentSpam(model) {
  //   return this.http.post(environment.baseUrl + `ORGVoiceMessages_Spam`, model);
  // }
  // messageLikeDis(model) {
  //   return this.http.post(environment.baseUrl + `ORGVoiceMessages_LikeDisLike`, model);
  // }
  // messageGetVoice(model) {
  //   return this.http.post(environment.baseUrl + `ORGVoiceMessages_GetVoice4User`, model);
  // }
  // myCarFixesList(model) {
  //   return this.http.post(environment.baseUrl + `MyCar_Repair_List`, model);
  // }
  // myCarDeleteFix(model) {
  //   return this.http.post(environment.baseUrl + `MyCar_Repair_Delete`, model);
  // }
  // myCarSaveFix(model) {
  //   return this.http.post(environment.baseUrl + `MyCar_Repair_Save`, model);
  // }
  // myCarEditFix(model) {
  //   return this.http.post(environment.baseUrl + `MyCar_Repair_Edit`, model);
  // }
  // zistYarTrashList(model) {
  //   return this.http.post(environment.baseUrl + `ZistYar_WastePrice_List`, model);
  // }
  // zistSoldList(model) {
  //   return this.http.post(environment.baseUrl + `ZistYar_Sold_List`, model);
  // }
  // zistSoldListItems(model) {
  //   return this.http.post(environment.baseUrl + `ZistYar_WasteAmount_List`, model);
  // }
  // zistAllActiveSells(model) {
  //   return this.http.post(environment.baseUrl + `ZistYar_4Sale_List`, model);
  // }
  // zistActiveSellDelete(model) {
  //   return this.http.post(environment.baseUrl + `ZistYar_Delete`, model);
  // }
  // zistActiveSellEdit(model) {
  //   return this.http.post(environment.baseUrl + `ZistYar_Edit`, model);
  // }
  // zistActiveSellItems(model) {
  //   return this.http.post(environment.baseUrl + `ZistYar_WasteAmount_List`, model);
  // }
  // zistWasteType(model) {
  //   return this.http.post(environment.baseUrl + `ZistYar_WasteType_List`, model);
  // }
  // setNewActiveSale(model) {
  //   return this.http.post(environment.baseUrl + `ZistYar_Save`, model);
  // }

  // UpdateJournalVissted(model, session) {
  //   return this.http.post(environment.baseUrl + `UpdateJournalVissted`, model, { params: session });
  // }

  login(model: any) {
    return this.http.post(environment.baseUrl + 'App_Login', model);
  }
  
  register(model: any) {
    return this.http.post(environment.baseUrl + 'App_Register', model);
  }

  cityName(model: any) {
    return this.http.post(
      environment.baseUrl +
        `GetCityVillageNameBaseLocation?fLat=${model.flat}&fLon=${model.flon}`,
      {}
    );
  }

  forgotPw(hpnumber) {
    return this.http.post(environment.baseUrl + 'App_Forgetpassword', {
      strMobile: hpnumber,
    });
  }

  adds(model) {
    return this.http.post(environment.baseUrl + 'GetAdsList', model);
  }

  SSOKeshvar_Step1(model) {
    return this.http.post(environment.baseUrl + `SSOKeshvar`, model);
  }

  SSOKeshvar_Step2(model) {
    return this.http.post(environment.baseUrl + `App_LoginBySSO`, model);
  }

  GetCity(code) {
    return this.http.post(environment.baseUrl + `GetCity?strSate=${code}`, {});
  }

  checkOtp(hpnumber, otp) {
    return this.http.post(environment.baseUrl + 'App_CheckRegisterOTP', {
      strMobile: hpnumber,
      strActivateCode: otp,
    });
  }

  ReverseGeocoding(fLon, fLat) {
    var model = {
      fLon: fLon,
      fLat: fLat,
    };
    return this.http.post(environment.baseUrl + `Dyar_ReverseGeocoding`, model);
  }

  GetState() {
    return this.http.post(environment.baseUrl + `GetState`, {});
  }

  GetVillageByState(code) {
    return this.http.post(
      environment.baseUrl + `GetVillageByState?strSate=${code}`,
      {}
    );
  }

  OnlineHelp(Id) {
    return this.http.post(
      environment.baseUrl + `Public_OnlineHelp?iHelpID=${Id}`,
      {}
    );
  }

  GetUserAbility(model) {
    return this.http.post(environment.baseUrl + `GetUserAbility`, model);
  }

  defaultHelp(model) {
    return this.http.post(environment.baseUrl + `Public_WhatDoesItDo`, model);
  }

  addView(model, id, session) {
    return this.http.post(
      environment.baseUrl +
        `UpdateAdsVissted?iUserManager_User=${id}&strSession=${session}`,
      model
    );
  }

  toastSwal(type, string, timer?) {
    if (timer === undefined) {
      timer = 3000;
    }
    Swal.fire({
      position: 'bottom-start',
      icon: type,
      toast: true,
      background:
        type == 'success'
          ? '#008631'
          : type == 'error'
          ? '#DF1C24'
          : type == 'warning'
          ? '#54c3e6'
          : '#3fc3ee',
      color: '#fff',
      timerProgressBar: true,
      title: string,
      customClass: {
        title: 'toaster-lineSpacing',
      },
      showConfirmButton: false,
      timer: timer,
    });
  }

  // Dyar start from here (meybe,not sure :D !!!!)

  publicBiorhythm(model) {
    return this.http.post(environment.baseUrl + 'Public_Biorhythm', model);
  }

  publicBiorhythm30Periods(model) {
    return this.http.post(
      environment.baseUrl + 'Public_BiorhythmCharts',
      model
    );
  }

  searchProducts(model) {
    return this.http.post(environment.baseUrl + `Samsari_Search`, model);
  }
  getCondiationList() {
    return this.http.post(environment.baseUrl + `SamsariCondiation_List`, {});
  }
  getGroupList() {
    return this.http.post(environment.baseUrl + `Samsari_Group_List`, {});
  }
  getGroupListSearch() {
    return this.http.post(
      environment.baseUrl + `Samsari_Group_ListHaveInfo`,
      {}
    );
  }
  getSubGroupList(Id) {
    return this.http.post(
      environment.baseUrl + `Samsari_SubGroup_List?iSamsari_Group=${Id}`,
      {}
    );
  }
  getSubGroupListSearch(Id) {
    return this.http.post(
      environment.baseUrl +
        `Samsari_SubGroup_ListHaveInfo?iSamsari_Group=${Id}`,
      {}
    );
  }
  saveSemsari(model) {
    return this.http.post(environment.baseUrl + `Samsari_Save4User`, model);
  }
  deleteSemsari(model) {
    return this.http.post(environment.baseUrl + `Samsari_Delete4User`, model);
  }
  deleteEstate(model) {
    return this.http.post(
      environment.baseUrl + `RealEstate_Delete4User`,
      model
    );
  }
  deleteCar(model) {
    return this.http.post(environment.baseUrl + `Car_Delete4User`, model);
  }
  editSemsari(model) {
    return this.http.post(environment.baseUrl + `Samsari_Edit4User`, model);
  }
  editEstate(model) {
    return this.http.post(environment.baseUrl + `RealEstate_Edit4User`, model);
  }
  editCar(model) {
    return this.http.post(environment.baseUrl + `Car_Edit4User`, model);
  }
  getSemsariList(model) {
    return this.http.post(environment.baseUrl + `Samsari_List4User`, model);
  }
  samsariInfo(model) {
    return this.http.post(environment.baseUrl + `Samsari_Info`, model);
  }
  getAds_details(model) {
    return this.http.post(environment.baseUrl + `Dyar_GeneralInfo`, model);
  }
  getAds_Images(model) {
    return this.http.post(environment.baseUrl + `Dyar_GeneralGallery`, model);
  }
  getSemsariGallery(Id) {
    return this.http.post(
      environment.baseUrl + `Samsari_Gallery_List?iSamsari=${Id}`,
      {}
    );
  }
  getStateGallery(Id) {
    return this.http.post(
      environment.baseUrl + `RealEstate_Gallery_List?iRealEstate=${Id}`,
      {}
    );
  }
  getCarGallery(Id) {
    return this.http.post(
      environment.baseUrl + `Car_Gallery_List?iCar=${Id}`,
      {}
    );
  }
  setSemsariGallery(model) {
    return this.http.post(
      environment.baseUrl + `Samsari_Gallery_Save4User`,
      model
    );
  }
  setRealEstateGallery(model) {
    return this.http.post(
      environment.baseUrl + `RealEstate_Gallery_Save4User`,
      model
    );
  }
  deleteSemsariGallery(model) {
    return this.http.post(
      environment.baseUrl + `Samsari_Gallery_Delete4User`,
      model
    );
  }
  deleteStateGallery(model) {
    return this.http.post(
      environment.baseUrl + `RealEstate_Gallery_Delete4User`,
      model
    );
  }
  deleteCarGallery(model) {
    return this.http.post(
      environment.baseUrl + `Car_Gallery_Delete4User`,
      model
    );
  }
  editSemsariGallery(model) {
    return this.http.post(
      environment.baseUrl + `Samsari_Gallery_Edit4User`,
      model
    );
  }
  resumeEdit(model) {
    return this.http.post(environment.baseUrl + `Resume_Edit`, model);
  }
  resumeInfo(model) {
    return this.http.post(environment.baseUrl + `Resume_Info`, model);
  }
  skillsDeleteSave(model) {
    return this.http.post(environment.baseUrl + `Resume_Expertise_Edit`, model);
  }
  getResumeGroupList() {
    return this.http.post(environment.baseUrl + `Resume_Category_List`, {});
  }
  getResumeGroupListSearch() {
    return this.http.post(
      environment.baseUrl + `Resume_Category_ListHaveInfo`,
      {}
    );
  }
  dateFormat() {
    return this.http.post(environment.baseUrl + `Dyar_DateFormat`, {});
  }
  appAbility() {
    return this.http.post(environment.baseUrl + `Dyar_GetAppAbility`, {});
  }
  getResumeGroupList4Resume() {
    return this.http.post(
      environment.baseUrl + `Resume_Category_List4Resume`,
      {}
    );
  }
  getResumeSubGroupList(Id) {
    return this.http.post(
      environment.baseUrl + `Resume_SubCategory_List?iResume_Category=${Id}`,
      {}
    );
  }
  getResumeSubGroupListSearch(Id) {
    return this.http.post(
      environment.baseUrl +
        `Resume_SubCategory_ListHaveInfo?iResume_Category=${Id}`,
      {}
    );
  }
  dyarHelp(Id) {
    return this.http.post(
      environment.baseUrl + `Dyar_GetAdRegHelp?iID=${Id}`,
      {}
    );
  }
  getResumeSubGroupList4Resume(Id) {
    return this.http.post(
      environment.baseUrl +
        `Resume_SubCategory_List4Resume?iResume_Category=${Id}`,
      {}
    );
  }
  getWorkList(model) {
    return this.http.post(environment.baseUrl + `Resume_Gallery_List`, model);
  }
  saveWork(model) {
    return this.http.post(environment.baseUrl + `Resume_Gallery_Save`, model);
  }
  deleteWork(model) {
    return this.http.post(environment.baseUrl + `Resume_Gallery_Delete`, model);
  }
  editWork(model) {
    return this.http.post(environment.baseUrl + `Resume_Gallery_Edit`, model);
  }
  hamyarSave(model) {
    return this.http.post(environment.baseUrl + `SupportServices_Save`, model);
  }
  hamyarList(model) {
    return this.http.post(environment.baseUrl + `SupportServices_List`, model);
  }
  hamyarDelete(model) {
    return this.http.post(
      environment.baseUrl + `SupportServices_Delete`,
      model
    );
  }
  hamyarEdit(model) {
    return this.http.post(environment.baseUrl + `SupportServices_Edit`, model);
  }
  hamyarSearch(model) {
    return this.http.post(
      environment.baseUrl + `SupportServices_Search`,
      model
    );
  }

  employmentSave(model) {
    return this.http.post(environment.baseUrl + `Employment_Save`, model);
  }
  employmentList(model) {
    return this.http.post(environment.baseUrl + `Employment_List`, model);
  }
  employmentDelete(model) {
    return this.http.post(environment.baseUrl + `Employment_Delete`, model);
  }
  employmentEdit(model) {
    return this.http.post(environment.baseUrl + `Employment_Edit`, model);
  }
  employmentSearch(model) {
    return this.http.post(environment.baseUrl + `Employment_Search`, model);
  }
  JobSeekerSave(model) {
    return this.http.post(environment.baseUrl + `JobSeeker_Save`, model);
  }
  JobSeekerList(model) {
    return this.http.post(environment.baseUrl + `JobSeeker_List`, model);
  }
  JobSeekerDelete(model) {
    return this.http.post(environment.baseUrl + `JobSeeker_Delete`, model);
  }
  JobSeekerEdit(model) {
    return this.http.post(environment.baseUrl + `JobSeeker_Edit`, model);
  }
  JobSeekerSearch(model) {
    return this.http.post(environment.baseUrl + `JobSeeker_Search`, model);
  }
  getAllChats(model) {
    return this.http.post(
      environment.baseUrl + `UserMes_Message_ListActive`,
      model
    );
  }
  getChatList(model) {
    return this.http.post(environment.baseUrl + `UserMes_Message_List`, model);
  }
  sendChat(model) {
    return this.http.post(environment.baseUrl + `UserMes_Message_Save`, model);
  }
  meetList(model) {
    return this.http.post(environment.baseUrl + `MeetingRequest_List`, model);
  }
  meetSave(model) {
    return this.http.post(environment.baseUrl + `MeetingRequest_Save`, model);
  }
  meetDelete(model) {
    return this.http.post(environment.baseUrl + `MeetingRequest_Delete`, model);
  }
  meetEdit(model) {
    return this.http.post(environment.baseUrl + `MeetingRequest_Edit`, model);
  }
  myAds(model) {
    return this.http.post(environment.baseUrl + `Advertising_My`, model);
  }
  adsList(model) {
    if (!model.strTitle) model.strTitle = '';

    if (!model.strCity) model.strCity = '';

    return this.http.post(environment.baseUrl + `Advertising_List`, model);
  }
  getDiarList() {
    return this.http.post(environment.baseUrl + `Dyar_City_List`, {});
  }
  getDiarList4Support() {
    return this.http.post(
      environment.baseUrl + `Dyar_City_List4SupportServices4Save`,
      {}
    );
  }
  getCurrency() {
    return this.http.post(environment.baseUrl + `Dyar_Currency`, {});
  }
  // Dyar
  getCentroid(model) {
    return this.http.post(environment.baseUrl + `City_Centroid`, model);
  }
  Dyar_City_List() {
    return this.http.post(environment.baseUrl + `Dyar_City_List`, {});
  }
  DyarCityListByImage() {
    return this.http.post(environment.baseUrl + `Dyar_City_ListWithImage`, {});
  }
  Advertising_Like_List() {
    return this.http.post(environment.baseUrl + `Advertising_Like_List`, {});
  }
  Dyar_City_ListSupport() {
    return this.http.post(
      environment.baseUrl + `Dyar_City_List4SupportServices`,
      {}
    );
  }

  Dyar_Register(model) {
    return this.http.post(environment.baseUrl + `Dyar_App_Register`, model);
  }
  Dyar_CheckMobile(model) {
    return this.http.post(environment.baseUrl + `Dyar_App_CheckMobile`, model);
  }

  Dyar_OtpAgain(model) {
    return this.http.post(environment.baseUrl + `Dyar_App_SendOTP`, model);
  }

  Dyar_OtpCheck(model) {
    return this.http.post(environment.baseUrl + `Dyar_CheckRegisterOTP`, model);
  }

  Dyar_Add_Remove_Bookmark(model) {
    return this.http.post(
      environment.baseUrl + `Dyar_LikeAds_SaveDelete`,
      model
    );
  }

  Dyar_Check_Bookmark(model) {
    return this.http.post(environment.baseUrl + `Dyar_LikeAds_Check`, model);
  }

  Dyar_adsUserInfo(model) {
    return this.http.post(environment.baseUrl + `Dyar_GetUserInfo`, model);
  }

  Dyar_UpdateProfile(model) {
    return this.http.post(
      environment.baseUrl + `Dyar_App_UpdateProfile`,
      model
    );
  }

  Dyar_BookmarkList(model) {
    return this.http.post(environment.baseUrl + `Dyar_LikeAds_List`, model);
  }

  Dyar_RecentVisits(model) {
    return this.http.post(
      environment.baseUrl + `Dyar_RecentVisits_List`,
      model
    );
  }
  Dyar_RecentVisits_Resume(model) {
    return this.http.post(
      environment.baseUrl + `Dyar_Resume_RecentVisits_List`,
      model
    );
  }
  Dyar_BookmarkList_Resume(model) {
    return this.http.post(
      environment.baseUrl + `Dyar_Resume_LikeAds_List`,
      model
    );
  }

  Dyar_UpdateComment(model) {
    fetch(environment.baseUrl + `Dyar_RecentVisits_UpdateComment`, {
      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify(model),
    });
  }

  Dyar_BusinessGroup() {
    return this.http.post(
      environment.baseUrl + `Resume_Category_List4Resume`,
      {}
    );
  }
  Dyar_BusinessGroupSearch() {
    return this.http.post(
      environment.baseUrl + `Resume_Category_List4ResumeHaveInfo`,
      {}
    );
  }

  Dyar_BusinessSubgroup(iResume_Category) {
    return this.http.post(
      environment.baseUrl +
        `Resume_SubCategory_List4Resume?iResume_Category=${iResume_Category}`,
      {}
    );
  }
  Dyar_BusinessSubgroupSearch(iResume_Category) {
    return this.http.post(
      environment.baseUrl +
        `Resume_SubCategory_List4ResumeHaveInfo?iResume_Category=${iResume_Category}`,
      {}
    );
  }

  get_AdsDetail_VS_Check_Bookmark(model): Observable<any> {
    return forkJoin([
      this.getAds_details(model),
      this.Dyar_Check_Bookmark(model),
    ]).pipe(map(([adsDetail, bookMark]) => ({ adsDetail, bookMark })));
  }

  getRealStateGroupList() {
    return this.http.post(environment.baseUrl + `RealEstate_Group_List`, {});
  }
  getRealStateGroupListSearch() {
    return this.http.post(
      environment.baseUrl + `RealEstate_Group_ListHaveInfo`,
      {}
    );
  }

  getRealStateSubGroupList(Id) {
    return this.http.post(
      environment.baseUrl + `RealEstate_SubGroup_List?tiRealEstate_Group=${Id}`,
      {}
    );
  }
  getRealStateSubGroupListSearch(Id) {
    return this.http.post(
      environment.baseUrl +
        `RealEstate_SubGroup_ListHaveInfo?tiRealEstate_Group=${Id}`,
      {}
    );
  }

  saveRealState(model) {
    return this.http.post(environment.baseUrl + `RealEstate_Save4User`, model);
  }

  saveGallaryRealState(model) {
    return this.http.post(
      environment.baseUrl + `RealEstate_Gallery_Save4User`,
      model
    );
  }

  resume_Info4User(model) {
    return this.http.post(environment.baseUrl + `Resume_Info4User`, model);
  }

  resume_Gallery_List(model) {
    return this.http.post(
      environment.baseUrl + `Resume_Gallery_List4User`,
      model
    );
  }

  Advertising_List(model) {
    return this.http.post(environment.baseUrl + `Advertising_List`, model);
  }

  // save business by org user

  resume_ORG_Save(model) {
    return this.http.post(environment.baseUrl + `Resume_ORG_Save`, model);
  }

  resume_ORG_Edit(model) {
    return this.http.post(environment.baseUrl + `resume_ORG_Edit`, model);
  }

  resume_Org_Gallery(model) {
    return this.http.post(
      environment.baseUrl + `Resume_ORG_Gallery_List`,
      model
    );
  }

  resume_Org_Gallery_Delete(model) {
    return this.http.post(
      environment.baseUrl + `Resume_Gallery_ORG_Delete`,
      model
    );
  }

  resume_Org_Gallery_Edit(model) {
    return this.http.post(
      environment.baseUrl + `Resume_Gallery_ORG_Edit`,
      model
    );
  }

  resume_Org_Gallery_Save(model) {
    return this.http.post(
      environment.baseUrl + `Resume_Gallery_ORG_Save`,
      model
    );
  }

  resume_ORG_Info(model) {
    return this.http.post(environment.baseUrl + `Resume_ORG_Info`, model);
  }

  getTiketList(model) {
    return this.http.post(environment.baseUrl + `Tiket_List`, model);
  }
  getTiketSubjects(model) {
    return this.http.post(environment.baseUrl + `TiketSubject_List`, model);
  }
  getTiketAnswers(model) {
    return this.http.post(environment.baseUrl + `TiketActions_List`, model);
  }
  saveTiket(model) {
    return this.http.post(environment.baseUrl + `Tiket_Save`, model);
  }
  deleteTiket(model) {
    return this.http.post(environment.baseUrl + `Tiket_DeleteByUser`, model);
  }
  sendTiketActionUser(model) {
    return this.http.post(
      environment.baseUrl + `TiketActions_User_Save`,
      model
    );
  }
  dyarNews(model) {
    return this.http.post(
      environment.baseUrl + `Dyar_Journal_List4Main`,
      model
    );
  }
  getCountryList() {
    return this.http.post(environment.baseUrl + `Dyar_Country_List`, {});
  }
  adsSimlarList(model) {
    return this.http.post(
      environment.baseUrl + `Advertising_Simlar_List`,
      model
    );
  }
  resumeSimlarList(model) {
    return this.http.post(environment.baseUrl + `Resume_Similar`, model);
  }
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.encryptionKey).toString();
  }
  decrypt(value: string) {
    return value != null
      ? CryptoJS.AES.decrypt(value, this.encryptionKey).toString(
          CryptoJS.enc.Utf8
        )
      : '';
  }
  Car_FuelType_List() {
    return this.http.post(environment.baseUrl + `Car_FuelType_List`, {});
  }
  Car_FuelType_List_Info() {
    return this.http.post(
      environment.baseUrl + `Car_FuelType_ListHaveInfo`,
      {}
    );
  }
  Car_Color_List() {
    return this.http.post(environment.baseUrl + `Car_Color_List`, {});
  }
  Car_GearboxType_List() {
    return this.http.post(environment.baseUrl + `Car_GearboxType_List`, {});
  }
  Car_GearboxType_List_Info() {
    return this.http.post(
      environment.baseUrl + `Car_GearboxType_ListHaveInfo`,
      {}
    );
  }
  Car_Class_List() {
    return this.http.post(environment.baseUrl + `Car_Class_List`, {});
  }
  Car_Class_List_Info() {
    return this.http.post(environment.baseUrl + `Car_Class_ListHaveInfo`, {});
  }
  Car_Brand_List() {
    return this.http.post(environment.baseUrl + `Car_Brand_List`, {});
  }
  Car_Brand_List_Info() {
    return this.http.post(environment.baseUrl + `Car_Brand_ListHaveInfo`, {});
  }
  Car_BodyCondiation_List() {
    return this.http.post(environment.baseUrl + `Car_BodyCondiation_List`, {});
  }
  Car_EnginCondiation_List() {
    return this.http.post(environment.baseUrl + `Car_EnginCondiation_List`, {});
  }
  Car_ChassisCondiation_List() {
    return this.http.post(
      environment.baseUrl + `Car_ChassisCondiation_List`,
      {}
    );
  }
  saveCarAds(model) {
    return this.http.post(environment.baseUrl + `Car_Save4User`, model);
  }
  saveGallaryCar(model) {
    return this.http.post(environment.baseUrl + `Car_Gallery_Save4User`, model);
  }
  samsari_Info(model) {
    return this.http.post(environment.baseUrl + `Samsari_Info4User`, model);
  }
  ReaalState_Info(model) {
    return this.http.post(environment.baseUrl + `RealEstate_Info`, model);
  }
  car_Info(model) {
    return this.http.post(environment.baseUrl + `Car_Info4User`, model);
  }
  Cooperation_Info(model) {
    return this.http.post(environment.baseUrl + `SupportServices_Info`, model);
  }
  Employment_Info(model) {
    return this.http.post(environment.baseUrl + `Employment_Info`, model);
  }
  getDyarJournalDetail(model) {
    return this.http.post(environment.baseUrl + `Journal_Dyar_Info`, model);
  }
  // getbeh() {
  //   return this.http.post( `http://localhost:5000/getAllProducts`, {});
  // }
  getAllProducts() {
    return this.http.get('http://localhost:5000/getAllProducts');
  }
  
}
