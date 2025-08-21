// next
import Image from 'next/image';
import NextLink from 'next/link';

// project import

// assets
const error404 = '/assets/images/maintenance/Error404.png';
const TwoCone = '/assets/images/maintenance/TwoCone.png';

// ==============================|| PAGE ||============================== //

function Error404() {
  return (
    <div className="flex flex-col items-center w-full justify-center min-h-screen pt-6 pb-6 overflow-hidden">
      <div className="flex flex-row  ">
        <div className="relative w-60 h-32 sm:w-96 sm:h-72">
          <Image src={error404} alt="mantis" layout="fill" sizes="100vw" />
        </div>
        <div className="relative">
          <div className="absolute top-15 left-[-10px] w-32 h-28 sm:w-96 sm:h-80">
            <Image src={TwoCone} alt="mantis" layout="fill" sizes="100vw" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-6">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-gray-600 text-center w-3/4 sm:w-2/3">
          The page you are looking was moved, removed, renamed, or might never exist!
        </p>
        <NextLink href={"/"} passHref>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-blue-600">
            Back To Home
          </button>
        </NextLink>
      </div>
    </div>
  );
}

export default Error404;
