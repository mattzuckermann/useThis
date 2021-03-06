import React, { ReactElement } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/client';
import { User } from 'next-auth';

const LoggedIn = ({ user }: { user: User }): ReactElement => {
  return (
    <header>
      <h4>
        <Link href="/">
          <a>useThis.js</a>
        </Link>
      </h4>
      <nav>
        <Link href="/study">
          <a>Study</a>
        </Link>
        <Link href="/quizzes">
          <a>Tests</a>
        </Link>
        <Link href="/results">
          <a>Results</a>
        </Link>
        <a>
          <img
            className="avatar"
            src={user.image === null ? '/profileIcon.png' : user.image}
            alt="profile_avatar"
          />
        </a>
        <a>
          <button onClick={() => signOut()}>Logout</button>
        </a>
      </nav>
    </header>
  );
};

export default LoggedIn;
