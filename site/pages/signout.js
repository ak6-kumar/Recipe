/** @jsx jsx */

import { useEffect } from 'react';
import Router from 'next/router';
import { jsx } from '@emotion/core';

import { useAuth } from '../lib/authentication';
import { Container } from '../primitives';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Meta from '../components/Meta';
import Loading from '../components/Loading'

export default () => {
  const { isAuthenticated, signout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      Router.push('/');
      return;
    }
    signout();
  }, [isAuthenticated]);

  return (
    <>
      <Meta title="Sign out" />
      <Navbar background="white" />
      <Container>
        <p css={{ margin: '100px', textAlign: 'center' }}>Signing you out...  <Loading/></p>
      </Container>
      <div className="mt-5">
      <Footer />
      </div>    </>
  );
};
