import { ReactNode } from 'react';

// material-ui

// project import

interface Props {
  children: ReactNode;
}

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }: Props) => <main className=" lg:grid lg:grid-cols-2 ">{children}</main>;

export default AuthWrapper;
