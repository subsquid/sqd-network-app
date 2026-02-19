import * as yup from 'yup';

export const editGatewaySchema = yup.object({
  name: yup.string().label('Name').max(255).trim().required('Portal name is required'),
  public: yup.boolean(),
  endpointUrl: yup
    .string()
    .when('public', {
      is: true,
      then: schema => schema.required('Public endpoint URL is required'),
    })
    .label('Endpoint URL')
    .trim(),
  description: yup.string().label('Description').max(2000).trim(),
  email: yup
    .string()
    .label('Email address')
    .trim()
    .when('public', {
      is: true,
      then: schema => schema.required('Email is required'),
    }),
  website: yup.string().label('Website').trim(),
});

export const addGatewaySchema = editGatewaySchema.shape({
  peerId: yup
    .string()
    .matches(/^[a-z1-9]+$/i, 'Peer ID must contains only base 58 symbols')
    .length(52)
    .label('Peer ID')
    .trim()
    .required('Peer ID is required'),
  // vestingContract: yup.string().label('Vesting contract address').trim(),
});
