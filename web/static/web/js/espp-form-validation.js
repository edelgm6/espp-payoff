// const validation = new window.JustValidate('#form');

// validation
//   .addField('#name', [
//     {
//       rule: 'minLength',
//       value: 3,
//     },
//     {
//       rule: 'maxLength',
//       value: 30,
//     },
//   ]);

const validation = new window.JustValidate('#espp-form');

validation
    .addField('#volatility', [
        {
            rule: 'required',
            errorMessage: 'this field is required'
        },
    ])
    .addField('#price', [
        {
            rule: 'required',
            errorMessage: 'this field is required'
        },
    ])
    .addField('#ticker', [
        {
            rule: 'required',
            errorMessage: 'this field is required'
        },
    ]);