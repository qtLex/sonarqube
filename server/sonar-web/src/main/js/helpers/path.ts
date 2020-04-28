
class Replacement{

  searchValue: string;
  replaceValue: string;

  constructor(searchValue:string, replaceValue: string) {
    this.searchValue = searchValue;
    this.replaceValue = replaceValue;  
  }

  replace(path: string): string {
    return path.replace(this.searchValue, this.replaceValue);
  }
}

const replaceList: Replacement[] = [
  new Replacement('src/configuration/', ''),
  new Replacement('src/Configuration/', ''),
  new Replacement('/Ext/Form/', '.'),
  new Replacement('/Form/', '.'),
  new Replacement('/Forms/', '.'),
  new Replacement('/Ext/', '.'),
  new Replacement('/', '.'),
  new Replacement('.bsl', ''),
  new Replacement('.ObjectModule', '.МодульОбъекта'),
  new Replacement('.CommandModule', '.МодульКоманды'),
  new Replacement('.ManagerModule', '.МодульМенеджера'),
  new Replacement('.Module', '.Модуль'),
  new Replacement('DataProcessors.', 'Обработки.'),
  new Replacement('DataProcessors/', 'Обработки.'),
  new Replacement('CommonModules.', 'ОбщиеМодули.'),
  new Replacement('CommonModules/', 'ОбщиеМодули.'),
  new Replacement('CommonForms.', 'ОбщиеФормы.'),
  new Replacement('CommonForms/', 'ОбщиеФормы.'),
  new Replacement('Catalogs.', 'Справочники.'),
  new Replacement('Catalogs/', 'Справочники.'),
  new Replacement('ExchangePlans.', 'ПланыОбмена.'),
  new Replacement('ExchangePlans/', 'ПланыОбмена.'),
  new Replacement('Ext.ManagedApplicationModule', 'МодульУправляемогоПриложения'),
  new Replacement('Ext.OrdinaryApplicationModule', 'МодульОбычногоПриложения'),
  new Replacement('InformationRegisters.', 'РегистрыСведений.'),
  new Replacement('InformationRegisters/', 'РегистрыСведений.'),
  new Replacement('Commands.', '.'),
  new Replacement('Commands/', '.'),
  new Replacement('src.', ''),
  new Replacement('src/', ''),
];

export function formatTo1CStyle(path: string): string { 
  let newPath: string = path;
  replaceList.forEach((replacement: Replacement) => newPath = replacement.replace(newPath));
  return newPath;
}