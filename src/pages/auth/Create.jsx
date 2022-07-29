import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TextInput from '../../components/inputs/TextInput';
import Button from '../../components/Button';
import SimpleFormPage from '../../components/SimpleFormPage';
import Text from '../../components/Text';
import Bao from '../../components/svg/Bao';

export default function Create({ callback }) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('');
  const [loading, setLoading] = useState(false);

  useDocumentTitle('CREATE_ACCOUNT');

  const disableCreate =
    password === '' || loading || password !== passwordConfirmation;

  let errorId = null;
  if (password !== passwordConfirmation)
    errorId = 'PASSWORDS_DO_NOT_MATCH';

  return (
    <SimpleFormPage
      titleId="CREATE_ACCOUNT"
      instructionsId="CREATE_ACCOUNT_INSTRUCTIONS"
      BaoComponent={Bao}
    >
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: '16px 0', width: 280 }}
      >
        <Grid item>
          <TextInput
            schema={{ labelId: 'YOUR_NAME' }}
            value={name}
            onChange={newName => setName(newName)}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <TextInput
            schema={{ labelId: 'PASSWORD' }}
            value={password}
            onChange={newPassword => setPassword(newPassword)}
            variant="outlined"
            type="password"
          />
        </Grid>
        <Grid item>
          <TextInput
            schema={{ labelId: 'CONFIRM_PASSWORD' }}
            value={passwordConfirmation}
            onChange={newPassword =>
              setPasswordConfirmation(newPassword)
            }
            variant="outlined"
            type="password"
          />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <Button
            disabled={disableCreate}
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                if (callback) {
                  callback();
                } else {
                  history.push('/welcome');
                }
              }, 1000);
            }}
            style={{ width: '100%' }}
            display="primary"
            id="CREATE_ACCOUNT"
          />
          {loading && (
            <CircularProgress
              size={24}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: -12,
                marginTop: -12,
              }}
            />
          )}
        </Grid>
        {errorId && (
          <Text
            variant="caption"
            color="error"
            style={{ paddingLeft: 8 }}
            id={errorId}
          />
        )}
      </Grid>
    </SimpleFormPage>
  );
}
