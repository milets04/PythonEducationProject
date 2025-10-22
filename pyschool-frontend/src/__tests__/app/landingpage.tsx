import {render, screen} from '@testing-library/react'
import LandingpageTemplate from '@/ui/components/templates/landingpageTemplate';

describe("LangindPage", () =>
{    
    const setup =() =>render(<LandingpageTemplate/>)

    it('renders header', ()=>{
        setup()
        expect(screen.getByText(/sign in/i)).toBeInTheDocument()
        expect(screen.getByText(/register/i)).toBeInTheDocument()
    });
    it('renders landingpage', ()=>{
        setup()
        expect(screen.getByText(/Let's learn python/i)).toBeInTheDocument()
    });
})