import React from 'react';

import IconBlack from '../../components/IconBlack';
import Image from '../../components/Image';
import Main from '../../components/Main';
import NavigationHeaderWhite from '../../components/NavigationHeaderWhite';
import ParagraphBlack from '../../components/ParagraphBlack';
import PrimaryButton from '../../components/PrimaryButton';
import Row from '../../components/Row';
import Stack from '../../components/Stack';

export default () => (
  <Main style={{ justifyContent: 'top', alignItems: 'center' }}>
    <NavigationHeaderWhite>
      <IconBlack liga="bars" />
      <Image style={{ width: '50px', height: '50px', backgroundImage: 'url(/images/placeholder-01.jpg)' }} />
    </NavigationHeaderWhite>
    <Stack style={{ flexGrow: '0', alignSelf: 'auto', minWidth: '50px', minHeight: '50px' }}>
      <Row style={{ justifyContent: 'center', flexGrow: '0', alignSelf: 'auto', minWidth: '50px', minHeight: '50px' }}>
        <Image style={{ width: '350px', height: '260px', backgroundImage: 'url(/images/placeholder-02.jpg)' }} />
      </Row>
      <Row style={{ justifyContent: 'center', flexGrow: '0', alignSelf: 'auto', minWidth: '50px', minHeight: '50px' }}>
        <ParagraphBlack style={{ width: '350px', minHeight: '50px' }}>
          In this demo screen you can see how to import and use the generated code components in your app.
        </ParagraphBlack>
      </Row>
      <Row style={{ justifyContent: 'center', flexGrow: '0', alignSelf: 'auto', minWidth: '50px', minHeight: '50px' }}>
        <PrimaryButton>
          Okay, understood
        </PrimaryButton>
      </Row>
    </Stack>
  </Main>
);
