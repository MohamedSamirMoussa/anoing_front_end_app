import "../auth/login.css";
import Image from "next/image";
import two from "../../public/two.png";
import Link from "next/link";
const register = () => {


  return (
    <div className="login relative">
      <div className="container w-[80%] h-screen m-auto flex justify-center items-center gap-16">
        <div className="img">
          <figure>
            <Image
              src={two}
              alt="minecraft-char-login"
              width={500}
              quality={80}
            />
          </figure>
        </div>
        <div>
          <div className="card rounded-2xl p-1 flex justify-center items-center my-3">
            <Link className="w-full text-center  " href={"/login"}>
              Sign In
            </Link>
            <Link
              className="w-full text-center active rounded-xl p-3"
              href={"/register"}
            >
              Sign up
            </Link>
          </div>
          <h1 className="text-6xl font-bold uppercase my-3">
            Enter your universe
          </h1>
          <p className="text-white my-3">
            Sign in to continue where your story left off.
          </p>
          <div className="inp flex flex-col gap-4 my-3">
            <input
              type="text"
              placeholder="username"
              className="w-full p-3 border border-white rounded-xl"
            />
            <input
              type="text"
              placeholder="password"
              className="w-full p-3 border border-white rounded-xl"
            />
            <input
              type="text"
              placeholder="Re-password"
              className="w-full p-3 border border-white rounded-xl"
            />
            <input
              type="text"
              placeholder="email"
              className="w-full p-3 border border-white rounded-xl"
            />
            <input
              type="text"
              placeholder="age"
              className="w-full p-3 border border-white rounded-xl"
            />
            <input
              type="text"
              placeholder="gender"
              className="w-full p-3 border border-white rounded-xl"
            />
            <span className="text-center text-white">-Or-</span>
            <div className="social flex justify-center items-center gap-4 text-white">
              <button className="border w-full rounded-2xl p-3">Google</button>
              <button className="border w-full rounded-2xl p-3">discord</button>
            </div>
            <button className="border w-full rounded-2xl p-3  text-white">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default register;
