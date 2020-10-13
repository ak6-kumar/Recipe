/** @jsx jsx */

import { useQuery } from '@apollo/client';
import getConfig from 'next/config';
import { jsx } from '@emotion/core';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Meta from '../components/Meta';
import Jumbo from '../components/Jumbotron';

const { publicRuntimeConfig } = getConfig();

export default function About() {
  const { meetup } = publicRuntimeConfig;

  return (
    <>
      <Meta title="About" description={meetup.aboutIntro} />
      <Navbar />
      <Jumbo/>
      <div><h1>About Us Page</h1>
      </div>
      <Footer />
    </>
  );
}

