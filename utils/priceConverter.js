import { WORDING, NUMBERING } from './constants.js';

  const { ANGKA, SATUAN, UNIQUE } = WORDING && NUMBERING;

  function wording (nominal) {
    if (nominal < UNIQUE.SEBELAS) {
      return ANGKA[nominal];
    }
    if (nominal < UNIQUE.SERATUS) {
      if (nominal < UNIQUE.DUA_PULUH) {
        if (nominal == UNIQUE.SEBELAS) return 'se' + SATUAN.BELASAN;
        return wording(nominal % UNIQUE.SEPULUH) + SATUAN.BELASAN;
      }
      return wording(Math.floor(nominal / UNIQUE.SEPULUH)) + SATUAN.PULUHAN + ((nominal % UNIQUE.SEPULUH < 1) ? '' : wording(nominal % UNIQUE.SEPULUH));;
    }
    if (nominal < UNIQUE.SERIBU) {
      if (nominal < UNIQUE.DUA_RATUS) {
        return 'se' + SATUAN.RATUSAN + ((nominal % UNIQUE.SERATUS < 1) ? '' : wording(nominal % UNIQUE.SERATUS));
      }
      return wording(Math.floor(nominal / UNIQUE.SERATUS)) + SATUAN.RATUSAN + ((nominal % UNIQUE.SERATUS < 1) ? '' : wording(nominal % UNIQUE.SERATUS));
    }
    if (nominal < UNIQUE.SATU_JUTA) {
      if (nominal < UNIQUE.DUA_RIBU) {
        return 'se' + SATUAN.RIBUAN + ((nominal % UNIQUE.SERIBU < 1) ? '' : wording(nominal % UNIQUE.SERIBU));
      }
      return wording(Math.floor(nominal / UNIQUE.SERIBU)) + SATUAN.RIBUAN + ((nominal % UNIQUE.SERIBU < 1) ? '' : wording(nominal % UNIQUE.SERIBU));
    }
    if (nominal < UNIQUE.SATU_MILIAR) {
      return wording(Math.floor(nominal / UNIQUE.SATU_JUTA)) + SATUAN.JUTAAN + ((nominal % UNIQUE.SATU_JUTA < 1) ? '' : wording(nominal % UNIQUE.SATU_JUTA));
    }
    if (nominal < UNIQUE.SATU_TRILLIUN) {
      return wording(Math.floor(nominal / UNIQUE.SATU_MILIAR)) + SATUAN.MILIARAN + ((nominal % UNIQUE.SATU_MILIAR < 1) ? '' : wording(nominal % UNIQUE.SATU_MILIAR));
    }

    return wording(Math.floor(nominal / UNIQUE.SATU_TRILLIUN)) + SATUAN.TRILIUNAN + ((nominal % UNIQUE.SATU_TRILLIUN < 1) ? '' : wording(nominal % UNIQUE.SATU_TRILLIUN));
  };
  
  function numbering (nominal) {
     if (nominal < UNIQUE.SEBELAS) {
        return ANGKA[nominal];
      }
      if (nominal < UNIQUE.SERATUS) {
        if (nominal < UNIQUE.DUA_PULUH) {
          if (nominal == UNIQUE.SEBELAS) return 'Rp. ' + SATUAN.BELASAN;
          return numbering(nominal % UNIQUE.SEPULUH) + SATUAN.BELASAN;
        }
        return numbering(Math.floor(nominal / UNIQUE.SEPULUH)) + SATUAN.PULUHAN + ((nominal % UNIQUE.SEPULUH < 1) ? '' : numbering(nominal % UNIQUE.SEPULUH));;
      }
      if (nominal < UNIQUE.SERIBU) {
        if (nominal < UNIQUE.DUA_RATUS) {
          return 'se' + SATUAN.RATUSAN + ((nominal % UNIQUE.SERATUS < 1) ? '' : numbering(nominal % UNIQUE.SERATUS));
        }
        return numbering(Math.floor(nominal / UNIQUE.SERATUS)) + SATUAN.RATUSAN + ((nominal % UNIQUE.SERATUS < 1) ? '' : numbering(nominal % UNIQUE.SERATUS));
      }
      if (nominal < UNIQUE.SATU_JUTA) {
        if (nominal < UNIQUE.DUA_RIBU) {
          return 'se' + SATUAN.RIBUAN + ((nominal % UNIQUE.SERIBU < 1) ? '' : numbering(nominal % UNIQUE.SERIBU));
        }
        return numbering(Math.floor(nominal / UNIQUE.SERIBU)) + SATUAN.RIBUAN + ((nominal % UNIQUE.SERIBU < 1) ? '' : numbering(nominal % UNIQUE.SERIBU));
      }
      if (nominal < UNIQUE.SATU_MILIAR) {
        return numbering(Math.floor(nominal / UNIQUE.SATU_JUTA)) + SATUAN.JUTAAN + ((nominal % UNIQUE.SATU_JUTA < 1) ? '' : numbering(nominal % UNIQUE.SATU_JUTA));
      }
      if (nominal < UNIQUE.SATU_TRILLIUN) {
        return numbering(Math.floor(nominal / UNIQUE.SATU_MILIAR)) + SATUAN.MILIARAN + ((nominal % UNIQUE.SATU_MILIAR < 1) ? '' : numbering(nominal % UNIQUE.SATU_MILIAR));
      }
      return numbering(Math.floor(nominal / UNIQUE.SATU_TRILLIUN)) + SATUAN.TRILIUNAN + ((nominal % UNIQUE.SATU_TRILLIUN < 1) ? '' : numbering(nominal % UNIQUE.SATU_TRILLIUN));
  };
  
  const toWord = (nominal) => {
    if (typeof nominal != 'number') {
      return 'Nominal must be a number!';
    } else {
      return wording(nominal) + 'rupiah';
    }
  };
  
  const toNumber = ({ text, options = {} }) => {
    if (typeof text != 'string') {
      return 'Text must be a string';
    } else {
      let result;
      if (options.rupiah) result = 'Rp. ';
      if (options.dots) 
      return result + numbering(text);
    }
  };
  
  export default { toWord, toNumber };