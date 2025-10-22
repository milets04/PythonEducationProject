import {render, screen} from '@testing-library/react'
import Page from '@/app/page'
import Welcome from '@/app/welcome/page'

it("render home page", ()=>{
    render(<Welcome/>)
    expect(screen.getByText(/pyson/i)).toBeInTheDocument()
}); 