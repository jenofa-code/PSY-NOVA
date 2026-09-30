import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, TranslationDictionary } from '../i18n/translations';


// Static UI strings that are not yet wired to the translation dictionary.
// The language switcher also translates these labels so every visible UI label
// follows the selected language, including screens that use legacy hard-coded text.
const UI_TRANSLATIONS: Record<string, { ta: string; hi: string }> = {
  "Dashboard": {ta:"டாஷ்போர்டு", hi:"डैशबोर्ड"},
  "Alerts": {ta:"முன்னெச்சரிக்கைகள்", hi:"अलर्ट"},
  "Follow-ups": {ta:"பின்தொடர்தல்கள்", hi:"फॉलो-अप"},
  "Profile & Credentials": {ta:"சுயவிவரம் & சான்றுகள்", hi:"प्रोफ़ाइल और प्रमाण-पत्र"},
  "Active Cases": {ta:"செயலில் உள்ள வழக்குகள்", hi:"सक्रिय मामले"},
  "Under active trajectory tracking": {ta:"மன அழுத்தப் பாதை தீவிரமாகக் கண்காணிக்கப்படுகிறது", hi:"तनाव प्रक्षेपवक्र की सक्रिय निगरानी"},
  "High-Risk Cases": {ta:"அதிக ஆபத்து வழக்குகள்", hi:"उच्च जोखिम वाले मामले"},
  "Distress score 60+ threshold": {ta:"60+ மன அழுத்த மதிப்பெண் வரம்பு", hi:"60+ तनाव स्कोर सीमा"},
  "Worsening Cases": {ta:"மோசமடையும் வழக்குகள்", hi:"बिगड़ते मामले"},
  "Upward distress velocity": {ta:"அதிகரிக்கும் மன அழுத்த வேகம்", hi:"बढ़ती तनाव गति"},
  "Follow-ups Due": {ta:"நிலுவையில் உள்ள பின்தொடர்தல்கள்", hi:"लंबित फॉलो-अप"},
  "Scheduled for human contact": {ta:"மனித தொடர்புக்காக திட்டமிடப்பட்டது", hi:"मानवीय संपर्क के लिए निर्धारित"},
  "Cases Needing Attention": {ta:"கவனம் தேவைப்படும் வழக்குகள்", hi:"ध्यान देने योग्य मामले"},
  "View All Cases": {ta:"அனைத்து வழக்குகளையும் காண்க", hi:"सभी मामले देखें"},
  "Worsening": {ta:"மோசமடைகிறது", hi:"बिगड़ता हुआ"},
  "Authorized Official": {ta:"அங்கீகரிக்கப்பட்ட அதிகாரி", hi:"अधिकृत अधिकारी"},
  "Credential ID:": {ta:"சான்று ID:", hi:"प्रमाण-पत्र ID:"},
  "Jurisdiction:": {ta:"அதிகார வரம்பு:", hi:"अधिकार क्षेत्र:"},
  "System Access:": {ta:"அமைப்பு அணுகல்:", hi:"सिस्टम एक्सेस:"},
  "Assigned Caseload:": {ta:"ஒதுக்கப்பட்ட வழக்குகள்:", hi:"सौंपे गए मामले:"},
  "Mandatory Clinical & Legal Disclaimers": {ta:"கட்டாய மருத்துவ & சட்ட மறுப்பு அறிவிப்புகள்", hi:"अनिवार्य चिकित्सीय और कानूनी अस्वीकरण"},
  "Sign Out": {ta:"வெளியேறு", hi:"साइन आउट"},
  "Early Warning Alerts": {ta:"முன்னெச்சரிக்கை எச்சரிக்கைகள்", hi:"प्रारंभिक चेतावनी अलर्ट"},
  "Acknowledge": {ta:"ஏற்றுக்கொள்", hi:"स्वीकार करें"},
  "Schedule Follow-up": {ta:"பின்தொடர்தலை திட்டமிடு", hi:"फॉलो-अप शेड्यूल करें"},
  "View Case": {ta:"வழக்கைக் காண்க", hi:"केस देखें"},
  "Schedule Human Follow-up": {ta:"மனித பின்தொடர்தலை திட்டமிடு", hi:"मानवीय फॉलो-अप शेड्यूल करें"},
  "Date": {ta:"தேதி", hi:"तारीख"},
  "Objective / Notes": {ta:"நோக்கம் / குறிப்புகள்", hi:"उद्देश्य / टिप्पणियाँ"},
  "Follow-up Management": {ta:"பின்தொடர்தல் மேலாண்மை", hi:"फॉलो-अप प्रबंधन"},
  "Record Follow-up": {ta:"பின்தொடர்தலை பதிவு செய்க", hi:"फॉलो-अप दर्ज करें"},
  "Case Note:": {ta:"வழக்கு குறிப்பு:", hi:"केस नोट:"},
  "Mark Completed": {ta:"முடிந்ததாகக் குறி", hi:"पूर्ण चिह्नित करें"},
  "Reopen": {ta:"மீண்டும் திற", hi:"फिर से खोलें"},
  "View Case Detail": {ta:"வழக்கு விவரங்களைக் காண்க", hi:"केस विवरण देखें"},
  "Case ID": {ta:"வழக்கு ID", hi:"केस ID"},
  "Follow-up Date": {ta:"பின்தொடர்தல் தேதி", hi:"फॉलो-अप तारीख"},
  "Status": {ta:"நிலை", hi:"स्थिति"},
  "Scheduled": {ta:"திட்டமிடப்பட்டது", hi:"निर्धारित"},
  "In Progress": {ta:"நடைபெறுகிறது", hi:"प्रगति में"},
  "Completed": {ta:"முடிந்தது", hi:"पूर्ण"},
  "Support / Referral Action": {ta:"ஆதரவு / பரிந்துரை நடவடிக்கை", hi:"सहायता / रेफरल कार्रवाई"},
  "Clinical Tele-Counselling": {ta:"மருத்துவ தொலை-ஆலோசனை", hi:"क्लिनिकल टेली-काउंसलिंग"},
  "Legal Aid (DLSA Consultation)": {ta:"சட்ட உதவி (DLSA ஆலோசனை)", hi:"कानूनी सहायता (DLSA परामर्श)"},
  "Witness Protection / Police Security Check": {ta:"சாட்சி பாதுகாப்பு / காவல் பாதுகாப்பு சோதனை", hi:"गवाह संरक्षण / पुलिस सुरक्षा जांच"},
  "Financial Assistance (CVCF Relief)": {ta:"நிதியுதவி (CVCF நிவாரணம்)", hi:"वित्तीय सहायता (CVCF राहत)"},
  "Short Case Note": {ta:"சுருக்கமான வழக்கு குறிப்பு", hi:"संक्षिप्त केस नोट"},
  "Case": {ta:"வழக்கு", hi:"केस"},
  "Distress Score": {ta:"மன அழுத்த மதிப்பெண்", hi:"तनाव स्कोर"},
  "Risk Level": {ta:"ஆபத்து நிலை", hi:"जोखिम स्तर"},
  "Trend / Trajectory": {ta:"போக்கு / பாதை", hi:"रुझान / प्रक्षेपवक्र"},
  "Last Check-in": {ta:"கடைசி மதிப்பீடு", hi:"अंतिम चेक-इन"},
  "Follow-up": {ta:"பின்தொடர்தல்", hi:"फॉलो-अप"},
  "Action": {ta:"நடவடிக்கை", hi:"कार्रवाई"},
  "Improving": {ta:"முன்னேற்றம்", hi:"सुधार"},
  "Stable": {ta:"நிலையானது", hi:"स्थिर"},
  "Low Risk": {ta:"குறைந்த ஆபத்து", hi:"कम जोखिम"},
  "Moderate Risk": {ta:"மிதமான ஆபத்து", hi:"मध्यम जोखिम"},
  "High Risk": {ta:"அதிக ஆபத்து", hi:"उच्च जोखिम"},
  "Risk: All": {ta:"ஆபத்து: அனைத்தும்", hi:"जोखिम: सभी"},
  "Trajectory: All": {ta:"பாதை: அனைத்தும்", hi:"प्रक्षेपवक्र: सभी"},
  "Follow-ups: All": {ta:"பின்தொடர்தல்கள்: அனைத்தும்", hi:"फॉलो-अप: सभी"},
  "Follow-up Due": {ta:"பின்தொடர்தல் நிலுவை", hi:"फॉलो-अप लंबित"},
  "Distress: High to Low": {ta:"மன அழுத்தம்: அதிகம் முதல் குறைவு", hi:"तनाव: अधिक से कम"},
  "Distress: Low to High": {ta:"மன அழுத்தம்: குறைவு முதல் அதிகம்", hi:"तनाव: कम से अधिक"},
  "Most Recent Check-in": {ta:"சமீபத்திய மதிப்பீடு", hi:"सबसे हाल का चेक-इन"},
  "Up to date": {ta:"புதுப்பிக்கப்பட்டது", hi:"अद्यतन"},
  "Current Score": {ta:"தற்போதைய மதிப்பெண்", hi:"वर्तमान स्कोर"},
  "Score Change": {ta:"மதிப்பெண் மாற்றம்", hi:"स्कोर परिवर्तन"},
  "Trajectory": {ta:"மன அழுத்தப் பாதை", hi:"तनाव प्रक्षेपवक्र"},
  "Escalation Risk": {ta:"தீவிரமடையும் ஆபத்து", hi:"बढ़ते संकट का जोखिम"},
  "Current": {ta:"தற்போது", hi:"वर्तमान"},
  "Previous": {ta:"முந்தையது", hi:"पिछला"},
  "Change": {ta:"மாற்றம்", hi:"परिवर्तन"},
  "Distress Trajectory": {ta:"மன அழுத்தப் பாதை", hi:"तनाव प्रक्षेपवक्र"},
  "Contributing Signals": {ta:"பங்களிக்கும் சமிக்ஞைகள்", hi:"योगदान देने वाले संकेत"},
  "Early Warning": {ta:"முன்னெச்சரிக்கை", hi:"प्रारंभिक चेतावनी"},
  "Explanation:": {ta:"விளக்கம்:", hi:"व्याख्या:"},
  "Human Follow-up Actions": {ta:"மனித பின்தொடர்தல் நடவடிக்கைகள்", hi:"मानवीय फॉलो-अप कार्रवाइयाँ"},
  "Add Case Note": {ta:"வழக்கு குறிப்பைச் சேர்க்கவும்", hi:"केस नोट जोड़ें"},
  "Review & mark": {ta:"மதிப்பாய்வு & குறியிடு", hi:"समीक्षा और चिह्नित करें"},
  "Set session date": {ta:"அமர்வு தேதியை அமைக்கவும்", hi:"सत्र की तारीख निर्धारित करें"},
  "Audit record": {ta:"தணிக்கை பதிவு", hi:"ऑडिट रिकॉर्ड"},
  "Refer to Counselling": {ta:"ஆலோசனைக்கு பரிந்துரைக்கவும்", hi:"परामर्श के लिए रेफर करें"},
  "Refer to Support Services": {ta:"ஆதரவு சேவைகளுக்கு பரிந்துரைக்கவும்", hi:"सहायता सेवाओं के लिए रेफर करें"},
  "Referral Service": {ta:"பரிந்துரை சேவை", hi:"रेफरल सेवा"},
  "Instructions / Note": {ta:"வழிமுறைகள் / குறிப்பு", hi:"निर्देश / नोट"},
  "Analytics": {ta:"பகுப்பாய்வு", hi:"एनालिटिक्स"},
  "Aggregated Monitored Cohort": {ta:"கண்காணிக்கப்படும் குழு", hi:"निगरानी समूह"},
  "Mean Response Latency": {ta:"சராசரி பதில் தாமதம்", hi:"औसत प्रतिक्रिया विलंब"},
  "Early Alert Accuracy": {ta:"முன்னெச்சரிக்கை எச்சரிக்கை துல்லியம்", hi:"प्रारंभिक चेतावनी सटीकता"},
  "Proactive Interventions": {ta:"முன்கூட்டிய தலையீடுகள்", hi:"सक्रिय हस्तक्षेप"},
  "Average Cohort Distress Over Time": {ta:"காலப்போக்கில் குழுவின் சராசரி மன அழுத்தம்", hi:"समय के साथ समूह का औसत तनाव"},
  "Risk Level Cohort Distribution": {ta:"ஆபத்து நிலை குழு விநியோகம்", hi:"जोखिम स्तर समूह वितरण"},
  "District-Level Vulnerability & Response Matrix": {ta:"மாவட்ட அளவிலான பாதிப்பு & பதில் அட்டவணை", hi:"जिला-स्तरीय संवेदनशीलता और प्रतिक्रिया मैट्रिक्स"},
  "District": {ta:"மாவட்டம்", hi:"जिला"},
  "Total Cases": {ta:"மொத்த வழக்குகள்", hi:"कुल मामले"},
  "Worsening Trajectory": {ta:"மோசமடையும் பாதை", hi:"बिगड़ता प्रक्षेपवक्र"},
  "Avg Distress": {ta:"சராசரி மன அழுத்தம்", hi:"औसत तनाव"},
  "Response Efficiency": {ta:"பதில் செயல்திறன்", hi:"प्रतिक्रिया दक्षता"},
  "New Check-in": {ta:"புதிய மதிப்பீடு", hi:"नया चेक-इन"},
  "Current Estimate": {ta:"தற்போதைய மதிப்பீடு", hi:"वर्तमान अनुमान"},
  "Overall Trend": {ta:"மொத்த போக்கு", hi:"कुल रुझान"},
  "Recent Change": {ta:"சமீபத்திய மாற்றம்", hi:"हालिया परिवर्तन"},
  "points": {ta:"புள்ளிகள்", hi:"अंक"},
  "Prototype estimate — not a clinical diagnosis.": {ta:"முன்மாதிரி மதிப்பீடு — மருத்துவ நோயறிதல் அல்ல.", hi:"प्रोटोटाइप अनुमान — चिकित्सीय निदान नहीं।"},
  "Case Reference": {ta:"வழக்கு குறிப்பு", hi:"केस संदर्भ"},
  "Next Follow-up Session": {ta:"அடுத்த பின்தொடர்தல் அமர்வு", hi:"अगला फॉलो-अप सत्र"},
  "Follow-up Status": {ta:"பின்தொடர்தல் நிலை", hi:"फॉलो-अप स्थिति"},
  "Send a Direct Note to Your Counsellor": {ta:"உங்கள் ஆலோசகருக்கு நேரடி குறிப்பை அனுப்பவும்", hi:"अपने परामर्शदाता को सीधा नोट भेजें"},
  "Send Note": {ta:"குறிப்பை அனுப்பவும்", hi:"नोट भेजें"},
  "Zero-Knowledge Confidentiality": {ta:"முழுமையான ரகசியத்தன்மை", hi:"पूर्ण गोपनीयता"},
  "24/7 National Support Helplines": {ta:"24/7 தேசிய ஆதரவு உதவி எண்கள்", hi:"24/7 राष्ट्रीय सहायता हेल्पलाइन"},
  "National Legal Services (NALSA)": {ta:"தேசிய சட்ட சேவைகள் (NALSA)", hi:"राष्ट्रीय कानूनी सेवाएँ (NALSA)"},
  "Immediate Emergency / Police": {ta:"அவசர உதவி / காவல்துறை", hi:"तत्काल आपातकाल / पुलिस"},
  "Participant File Details": {ta:"பங்கேற்பாளர் கோப்பு விவரங்கள்", hi:"प्रतिभागी फ़ाइल विवरण"},
  "Anonymized Case Identifier": {ta:"பெயரில்லா வழக்கு அடையாளம்", hi:"गुमनाम केस पहचानकर्ता"},
  "Assigned Support Professional": {ta:"ஒதுக்கப்பட்ட ஆதரவு நிபுணர்", hi:"सौंपे गए सहायता पेशेवर"},
  "Registration Date": {ta:"பதிவு தேதி", hi:"पंजीकरण तिथि"},
  "Cadence": {ta:"இடைவெளி", hi:"अंतराल"},
  "Preferred Language": {ta:"விருப்ப மொழி", hi:"पसंदीदा भाषा"},
  "Privacy & Prototype Notice": {ta:"தனியுரிமை & முன்மாதிரி அறிவிப்பு", hi:"गोपनीयता और प्रोटोटाइप सूचना"},
  "All records stored with pseudonymized IDs to ensure full privacy.": {ta:"முழு தனியுரிமைக்காக அனைத்து பதிவுகளும் புனைப்பெயர் ID-களுடன் சேமிக்கப்படுகின்றன.", hi:"पूर्ण गोपनीयता के लिए सभी रिकॉर्ड छद्म ID के साथ संग्रहीत हैं।"},
  "Never shared with commercial data brokers or public search engines.": {ta:"வணிக தரவு தரகர்கள் அல்லது பொது தேடுபொறிகளுடன் ஒருபோதும் பகிரப்படாது.", hi:"वाणिज्यिक डेटा ब्रोकर या सार्वजनिक सर्च इंजन के साथ कभी साझा नहीं किया जाता।"},
  "Sign Out of Participant Portal": {ta:"பங்கேற்பாளர் தளத்திலிருந்து வெளியேறு", hi:"प्रतिभागी पोर्टल से साइन आउट"},
  "Home": {ta:"முகப்பு", hi:"होम"},
  "Check-in": {ta:"மதிப்பீடு", hi:"चेक-इन"},
  "My History": {ta:"என் வரலாறு", hi:"मेरा इतिहास"},
  "Support": {ta:"ஆதரவு", hi:"सहायता"},
  "Profile & Privacy": {ta:"சுயவிவரம் & தனியுரிமை", hi:"प्रोफ़ाइल और गोपनीयता"},
  "Start Check-in": {ta:"மதிப்பீட்டைத் தொடங்கு", hi:"चेक-इन शुरू करें"},
  "Current Status": {ta:"தற்போதைய நிலை", hi:"वर्तमान स्थिति"},
  "Next Check-in": {ta:"அடுத்த மதிப்பீடு", hi:"अगला चेक-इन"},
  "Weekly periodic check-in": {ta:"வாராந்திர மதிப்பீடு", hi:"साप्ताहिक चेक-इन"},
  "Assigned Support": {ta:"ஒதுக்கப்பட்ட ஆதரவு", hi:"सौंपा गया समर्थन"},
  "Recent Trajectory Over Time": {ta:"சமீபத்திய காலவரிசை மன அழுத்தப் பாதை", hi:"समय के साथ हालिया तनाव प्रक्षेपवक्र"},
  "View Full History": {ta:"முழு வரலாற்றைக் காண்க", hi:"पूरा इतिहास देखें"},
  "Trajectory progression:": {ta:"பாதை முன்னேற்றம்:", hi:"प्रक्षेपवक्र प्रगति:"},
  "Tele-MANAS Toll-Free": {ta:"Tele-MANAS கட்டணமில்லா", hi:"Tele-MANAS टोल-फ्री"},
  "NALSA Legal Aid": {ta:"NALSA சட்ட உதவி", hi:"NALSA कानूनी सहायता"},
  "About Your Participant Case ID": {ta:"உங்கள் பங்கேற்பாளர் வழக்கு ID பற்றி", hi:"आपके प्रतिभागी केस ID के बारे में"},
  "Access Confidential Portal": {ta:"ரகசிய தளத்தை அணுகவும்", hi:"गोपनीय पोर्टल तक पहुँचें"},
  "Where is my Case ID?": {ta:"என் வழக்கு ID எங்கே?", hi:"मेरा केस ID कहाँ है?"},
  "Verifying Access Token...": {ta:"அணுகல் டோக்கனை சரிபார்க்கிறது...", hi:"एक्सेस टोकन सत्यापित किया जा रहा है..."},
  "Immediate Helpline: Tele-MANAS (": {ta:"உடனடி உதவி: Tele-MANAS (", hi:"तत्काल हेल्पलाइन: Tele-MANAS ("},
  "For this prototype, use": {ta:"இந்த முன்மாதிரிக்கு, இதைப் பயன்படுத்தவும்", hi:"इस प्रोटोटाइप के लिए, उपयोग करें"},
  "with PIN": {ta:"PIN உடன்", hi:"PIN के साथ"},
  "It prevents anyone from linking your real identity to your answers.": {ta:"உங்கள் உண்மையான அடையாளத்தை உங்கள் பதில்களுடன் இணைப்பதை இது தடுக்கிறது.", hi:"यह किसी को आपकी वास्तविक पहचान को आपके उत्तरों से जोड़ने से रोकता है।"},
  "Cancel & Back": {ta:"ரத்து செய்து திரும்பு", hi:"रद्द करें और वापस जाएँ"},
  "Next Step": {ta:"அடுத்த படி", hi:"अगला चरण"},
  "Back": {ta:"பின்செல்", hi:"वापस"},
  "Emotional State:": {ta:"உணர்ச்சி நிலை:", hi:"भावनात्मक स्थिति:"},
  "Perceived Safety Rating:": {ta:"உணரப்படும் பாதுகாப்பு மதிப்பீடு:", hi:"महसूस किया गया सुरक्षा स्तर:"},
  "Sleep Rating:": {ta:"தூக்க மதிப்பீடு:", hi:"नींद का मूल्यांकन:"},
  "Voice Sample Status:": {ta:"குரல் மாதிரி நிலை:", hi:"आवाज़ नमूना स्थिति:"},
  "Simulate missed previous check-ins:": {ta:"முந்தைய தவறிய மதிப்பீடுகளை உருவகப்படுத்து:", hi:"पिछले छूटे चेक-इन का अनुकरण करें:"},
  "0 (Regular on-time)": {ta:"0 (வழக்கம்போல் சரியான நேரத்தில்)", hi:"0 (नियमित समय पर)"},
  "1 (Recent missed window)": {ta:"1 (சமீபத்திய தவறிய காலம்)", hi:"1 (हाल की छूटी अवधि)"},
  "2 (Avoidance / Communication gap)": {ta:"2 (தவிர்ப்பு / தொடர்பு இடைவெளி)", hi:"2 (परहेज़ / संचार अंतर)"},
  "Optional — you can skip this step or write as much as you like.": {ta:"விருப்பத்தேர்வு — இந்த படியைத் தவிர்க்கலாம் அல்லது விருப்பமுள்ள அளவு எழுதலாம்.", hi:"वैकल्पिक — आप इस चरण को छोड़ सकते हैं या जितना चाहें लिख सकते हैं।"},
  "Reset": {ta:"மீட்டமை", hi:"रीसेट"},
  "Inspect": {ta:"ஆய்வு செய்க", hi:"जाँचें"},
  "Live command center": {ta:"நேரடி கட்டுப்பாட்டு மையம்", hi:"लाइव कमांड सेंटर"},
  "Trajectory Intelligence Dashboard": {ta:"மன அழுத்தப் பாதை நுண்ணறிவு டாஷ்போர்டு", hi:"तनाव प्रक्षेपवक्र इंटेलिजेंस डैशबोर्ड"},
  "SYNTHETIC DATA": {ta:"உருவக தரவு", hi:"सिंथेटिक डेटा"},
  "HUMAN-IN-THE-LOOP": {ta:"மனித மேற்பார்வை", hi:"मानव-नियंत्रित प्रणाली"},
  "Human review triggered": {ta:"மனித மதிப்பாய்வு தூண்டப்பட்டது", hi:"मानवीय समीक्षा शुरू हुई"},
  "LIVE MONITOR": {ta:"நேரடி கண்காணிப்பு", hi:"लाइव मॉनिटर"},
  "DISTRESS TREND": {ta:"மன அழுத்தப் போக்கு", hi:"तनाव रुझान"},
  "30-DAY ESCALATION": {ta:"30 நாள் தீவிரமாதல்", hi:"30-दिन संकट वृद्धि"},
  "Baseline": {ta:"அடிப்படை நிலை", hi:"आधार स्तर"},
  "Human-in-the-Loop Protocol": {ta:"மனித மேற்பார்வை நடைமுறை", hi:"मानव-नियंत्रित प्रोटोकॉल"},
  "Data Governance & DPDPA": {ta:"தரவு நிர்வாகம் & DPDPA", hi:"डेटा शासन और DPDPA"},
  "India compliant DPDPA & DISHA": {ta:"இந்திய DPDPA & DISHA இணக்கம்", hi:"भारत-अनुरूप DPDPA और DISHA"},
  "Zero stigma architecture": {ta:"களங்கமற்ற அமைப்பு", hi:"कलंक-मुक्त संरचना"},
  "Built to meet people in their own language": {ta:"மக்களின் சொந்த மொழியில் சேவை செய்ய வடிவமைக்கப்பட்டது", hi:"लोगों की अपनी भाषा में सेवा देने के लिए बनाया गया"},
  "End-to-End Architecture": {ta:"முழுமையான அமைப்பு கட்டமைப்பு", hi:"एंड-टू-एंड आर्किटेक्चर"},
  "The 6-Stage Trajectory Pipeline": {ta:"6-நிலை மன அழுத்தப் பாதை செயல்முறை", hi:"6-चरणीय तनाव प्रक्षेपवक्र पाइपलाइन"},
  "Open Officer Dashboard": {ta:"அதிகாரி டாஷ்போர்டைத் திற", hi:"अधिकारी डैशबोर्ड खोलें"},
  "Feature simulation active": {ta:"அம்ச உருவகப்படுத்தல் செயல்பாட்டில்", hi:"फीचर सिमुलेशन सक्रिय"},
  "Speech Cadence": {ta:"பேச்சு வேகம்", hi:"भाषण गति"},
  "Pause Interval": {ta:"இடைநிறுத்த இடைவெளி", hi:"रुकने का अंतराल"},
  "Pitch Jitter": {ta:"குரல் சுருதி மாறுபாடு", hi:"स्वर उतार-चढ़ाव"},
  "Click below to record a brief 10–15s vocal reflection": {ta:"10–15 விநாடி குரல் பதிவைச் செய்ய கீழே கிளிக் செய்யவும்", hi:"10–15 सेकंड की आवाज़ रिकॉर्ड करने के लिए नीचे क्लिक करें"},
  "No raw audio stored; extracts tension markers only.": {ta:"மூல ஆடியோ சேமிக்கப்படாது; அழுத்தக் குறியீடுகள் மட்டும் பெறப்படும்.", hi:"मूल ऑडियो संग्रहीत नहीं होता; केवल तनाव संकेत निकाले जाते हैं।"},
  "Case History & Logged Notes": {ta:"வழக்கு வரலாறு & பதிவு செய்யப்பட்ட குறிப்புகள்", hi:"केस इतिहास और दर्ज नोट्स"},
  "Early Warning Alert Triggered on Official Portal!": {ta:"அதிகாரி தளத்தில் முன்னெச்சரிக்கை எச்சரிக்கை தூண்டப்பட்டது!", hi:"अधिकारी पोर्टल पर प्रारंभिक चेतावनी अलर्ट सक्रिय!"},
  "Click any step to inspect the real-time AI state:": {ta:"நேரடி AI நிலையை ஆய்வு செய்ய எந்த படியையும் கிளிக் செய்யவும்:", hi:"रीयल-टाइम AI स्थिति देखने के लिए किसी भी चरण पर क्लिक करें:"},
  "Simulated Trajectory Velocity": {ta:"உருவகப்படுத்தப்பட்ட பாதை வேகம்", hi:"सिम्युलेटेड प्रक्षेपवक्र गति"},
  "Open Case #PSY-1024 in Professional Portal": {ta:"Professional Portal-ல் Case #PSY-1024-ஐத் திறக்கவும்", hi:"Professional Portal में Case #PSY-1024 खोलें"},
  "Demonstrates SIH26094 non-diagnostic proactive distress trajectory monitoring.": {ta:"SIH26094 மருத்துவ நோயறிதல் இல்லாத முன்கூட்டிய மன அழுத்தப் பாதை கண்காணிப்பை விளக்குகிறது.", hi:"SIH26094 गैर-नैदानिक सक्रिय तनाव प्रक्षेपवक्र निगरानी को प्रदर्शित करता है।"},
  "Optional": {ta:"விருப்பத்தேர்வு", hi:"वैकल्पिक"},
  "Clinical Counsellor (DMHP)": {ta:"மருத்துவ ஆலோசகர் (DMHP)", hi:"क्लिनिकल काउंसलर (DMHP)"},
  "Protection Officer (Social Justice)": {ta:"பாதுகாப்பு அதிகாரி (சமூக நீதி)", hi:"सुरक्षा अधिकारी (सामाजिक न्याय)"},
  "Madurai District": {ta:"மதுரை மாவட்டம்", hi:"मदुरै जिला"},
  "Coimbatore District": {ta:"கோயம்புத்தூர் மாவட்டம்", hi:"कोयंबटूर जिला"},
  "Tirunelveli District": {ta:"திருநெல்வேலி மாவட்டம்", hi:"तिरुनेல்வேலி जिला"},
  "Chennai Central": {ta:"சென்னை மத்திய", hi:"चेन्नई सेंट्रल"},
  "Thanjavur District": {ta:"தஞ்சாவூர் மாவட்டம்", hi:"तंजावुर जिला"},
  "Dindigul District": {ta:"திண்டுக்கல் மாவட்டம்", hi:"डिंडीगुल जिला"},
  "Enter confidential clinical observations, contact notes, or safety check summary...": {ta:"ரகசிய மருத்துவக் குறிப்புகள், தொடர்பு குறிப்புகள் அல்லது பாதுகாப்பு சுருக்கத்தை உள்ளிடவும்...", hi:"गोपनीय नैदानिक टिप्पणियाँ, संपर्क नोट्स या सुरक्षा सारांश दर्ज करें..."},
  "e.g. Discuss court summons anxiety and verify sleep status": {ta:"எ.கா. நீதிமன்ற அழைப்பாணை குறித்த கவலையைப் பற்றி விவாதித்து தூக்க நிலையை சரிபார்க்கவும்", hi:"जैसे: अदालत के समन की चिंता पर चर्चा करें और नींद की स्थिति जाँचें"},
  "Search by Case ID (e.g. PSY-1024), district, or stressor...": {ta:"Case ID (எ.கா. PSY-1024), மாவட்டம் அல்லது அழுத்த காரணியால் தேடவும்...", hi:"केस ID (जैसे PSY-1024), जिला या तनाव कारक से खोजें..."},
  "Clinical observations, key takeaways, or next steps agreed...": {ta:"மருத்துவக் கவனிப்புகள், முக்கிய குறிப்புகள் அல்லது ஒப்புக்கொண்ட அடுத்த படிகள்...", hi:"नैदानिक टिप्पणियाँ, मुख्य निष्कर्ष या सहमत अगले कदम..."},
  "e.g. Assess escalating distress and check safety": {ta:"எ.கா. அதிகரிக்கும் மன அழுத்தத்தை மதிப்பிட்டு பாதுகாப்பைச் சரிபார்க்கவும்", hi:"जैसे: बढ़ते तनाव का आकलन करें और सुरक्षा जाँचें"},
  "Official clearance passphrase": {ta:"அதிகாரப்பூர்வ அனுமதி கடவுச்சொல்", hi:"आधिकारिक अनुमति पासफ़्रेज़"},
  "Type your message here (e.g., 'Can we schedule a call tomorrow afternoon?')": {ta:"உங்கள் செய்தியை இங்கே உள்ளிடவும் (எ.கா., 'நாளை மதியம் அழைப்பை திட்டமிடலாமா?')", hi:"अपना संदेश यहाँ लिखें (जैसे, 'क्या हम कल दोपहर कॉल तय कर सकते हैं?')"},
  "Share any thoughts, feelings, or events that have been on your mind recently...": {ta:"சமீபத்தில் உங்கள் மனதில் இருந்த எண்ணங்கள், உணர்வுகள் அல்லது நிகழ்வுகளைப் பகிரவும்...", hi:"हाल में आपके मन में रहे विचार, भावनाएँ या घटनाएँ साझा करें..."},
  "Case not found or loaded.": {ta:"வழக்கு கிடைக்கவில்லை அல்லது ஏற்றப்படவில்லை.", hi:"केस नहीं मिला या लोड नहीं हुआ।"},
  "Add Clinical Case Note": {ta:"மருத்துவ வழக்கு குறிப்பைச் சேர்க்கவும்", hi:"नैदानिक केस नोट जोड़ें"},
  "Refer Case": {ta:"வழக்கைப் பரிந்துரைக்கவும்", hi:"केस रेफर करें"},
  "Session Objective": {ta:"அமர்வு நோக்கம்", hi:"सत्र का उद्देश्य"},
  "Your note has been securely forwarded to Dr. Anita Sharma. You will receive a follow-up confirmation.": {ta:"உங்கள் குறிப்பு டாக்டர் அனிதா ஷர்மாவிடம் பாதுகாப்பாக அனுப்பப்பட்டது. பின்தொடர்தல் உறுதிப்படுத்தலைப் பெறுவீர்கள்.", hi:"आपका नोट डॉ. अनीता शर्मा को सुरक्षित रूप से भेज दिया गया है। आपको फॉलो-अप पुष्टि मिलेगी।"},
  "Official Department Access": {ta:"அதிகாரப்பூர்வ துறை அணுகல்", hi:"आधिकारिक विभागीय प्रवेश"},
  "Authenticating Department Token...": {ta:"துறை டோக்கன் அங்கீகரிக்கப்படுகிறது...", hi:"विभागीय टोकन प्रमाणित किया जा रहा है..."},
  "Token:": {ta:"டோக்கன்:", hi:"टोकन:"},
  "Voice Reflection (Prototype Feature)": {ta:"குரல் பதிவு (முன்மாதிரி அம்சம்)", hi:"आवाज़ प्रतिबिंब (प्रोटोटाइप सुविधा)"},
  "Start Voice Reflection": {ta:"குரல் பதிவைத் தொடங்கு", hi:"आवाज़ रिकॉर्ड करना शुरू करें"},
  "Listening & analyzing acoustic signals...": {ta:"கேட்டு ஒலி சமிக்ஞைகளைப் பகுப்பாய்வு செய்கிறது...", hi:"ध्वनि संकेतों को सुनकर और विश्लेषण कर रहा है..."},
  "Stop & Save Audio Sample": {ta:"நிறுத்தி ஆடியோ மாதிரியைச் சேமிக்கவும்", hi:"रोकें और ऑडियो नमूना सहेजें"},
  "Voice sample recorded & acoustic markers processed": {ta:"குரல் மாதிரி பதிவு செய்யப்பட்டு ஒலி குறியீடுகள் செயலாக்கப்பட்டன", hi:"आवाज़ नमूना रिकॉर्ड किया गया और ध्वनि संकेत संसाधित किए गए"},
  "Submit My Check-In": {ta:"என் மதிப்பீட்டைச் சமர்ப்பிக்கவும்", hi:"मेरा चेक-इन सबमिट करें"},
  "Your check-in has been securely recorded.": {ta:"உங்கள் மதிப்பீடு பாதுகாப்பாகப் பதிவு செய்யப்பட்டது.", hi:"आपका चेक-इन सुरक्षित रूप से दर्ज किया गया है।"},
  "Salem District": {ta:"சேலம் மாவட்டம்", hi:"सेलम जिला"},
};

function buildTranslationLookup(lang: Language) {
  const lookup = new Map<string, string>();
  const addPairs = (en: unknown, target: unknown) => {
    if (typeof en === 'string' && typeof target === 'string') {
      lookup.set(en, target);
      lookup.set(target, target);
    } else if (Array.isArray(en) && Array.isArray(target)) {
      en.forEach((v, i) => addPairs(v, target[i]));
    } else if (en && target && typeof en === 'object' && typeof target === 'object') {
      Object.keys(en as object).forEach(k => addPairs((en as any)[k], (target as any)[k]));
    }
  };
  addPairs(translations.en, translations[lang]);
  Object.entries(UI_TRANSLATIONS).forEach(([en, vals]) => {
    lookup.set(en, lang === 'en' ? en : vals[lang]);
  });
  return lookup;
}

function translatePage(lang: Language) {
  const lookup = buildTranslationLookup(lang);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  nodes.forEach(node => {
    const raw = node.nodeValue || '';
    const text = raw.trim();
    if (!text || text.length < 2) return;
    const translated = lookup.get(text);
    if (translated) {
      node.nodeValue = raw.replace(text, translated);
    }
  });

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    'input[placeholder], textarea[placeholder], option'
  ).forEach(el => {
    const value = el.getAttribute('placeholder') || el.textContent?.trim() || '';
    const translated = lookup.get(value);
    if (translated) {
      if (el.tagName === 'OPTION') el.textContent = translated;
      else el.setAttribute('placeholder', translated);
    }
  });
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'psynova_lang_v2';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      return (saved === 'ta' || saved === 'hi' || saved === 'en') ? (saved as Language) : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;

    // Translate the current DOM once after React has rendered the selected language.
    // Do NOT observe every DOM mutation: changing text inside a MutationObserver
    // creates another mutation and can lock the browser in an update loop.
    const timer = window.setTimeout(() => translatePage(language), 0);
    return () => window.clearTimeout(timer);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language] || translations.en,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
