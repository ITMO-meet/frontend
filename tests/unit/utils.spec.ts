import { calculateAge, dataURLtoFile } from '../../src/utils';

describe('calculateAge', () => {

  it('calculate age, birthday in the future', () => {
    const birthdate = '2020-12-31';
    const age = calculateAge(birthdate);
    expect(age).toBe(4);
  });

  it('calculate age, happened future', () => {
    const birthdate = '2020-01-01';
    const age = calculateAge(birthdate);
    expect(age).toBe(5);
  });
});


describe('dataURLtoFile', () => {
  it('должна правильно конвертировать dataURL в объект File', () => {

    const base64PNG = // ну и жесть
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQAAAAC' +
      '1HAwCAAAAC0lEQVR42mNk+AAAABQBA3kBS6cAAAAASUVORK5CYII=';

    const filename = 'image.png';
    const file = dataURLtoFile(base64PNG, filename);

    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe(filename);
    expect(file.type).toBe('image/png');
    expect(file.size).toBeGreaterThan(0);
  });

});
