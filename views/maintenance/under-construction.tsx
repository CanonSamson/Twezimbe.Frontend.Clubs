// next
import Image from 'next/image';
import NextLink from 'next/link';

// project import
import { APP_DEFAULT_PATH } from '@/config';

// assets
const construction = '/assets/images/maintenance/under-construction.svg';

// ==============================|| UNDER CONSTRUCTION - MAIN ||============================== //

function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="relative w-72 h-64 sm:w-96 sm:h-[430px]">
        <Image src={construction} alt="mantis" fill sizes="100vw" />
      </div>
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-4xl text-center">Under Construction</h1>
        <p className="text-gray-500 text-center w-11/12 sm:w-4/5">
          Hey! Please check out this site later. We are doing some maintenance on it right now.
        </p>
        <NextLink href={APP_DEFAULT_PATH} passHref legacyBehavior>
          <button className="bg-primary text-white py-2 px-4 rounded">Back To Home</button>
        </NextLink>
      </div>
    </div>
  );
}

export default UnderConstruction;
