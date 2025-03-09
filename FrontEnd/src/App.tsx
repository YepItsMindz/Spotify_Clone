import { Button } from "./components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-red-600"> Hello world! </h1>
      <Button variant={"default"}> Hi </Button>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}

export default App
