import React from 'react';
import { Footer as FlowbiteFooter } from 'flowbite-react';

function CustomFooter() {
  return (
    <div>
      <FlowbiteFooter container>
        <div className="w-full text-center items-center">
        <div className="w-full justify-center flex flex-col sm:flex-row sm:items-center">
           
            <FlowbiteFooter.LinkGroup >
              <FlowbiteFooter.Link href="#">About</FlowbiteFooter.Link>
              <FlowbiteFooter.Link href="#">Privacy Policy</FlowbiteFooter.Link>
              <FlowbiteFooter.Link href="#">Licensing</FlowbiteFooter.Link>
              <FlowbiteFooter.Link href="#">Contact</FlowbiteFooter.Link>
            </FlowbiteFooter.LinkGroup>
          </div>
          <FlowbiteFooter.Divider />
          <FlowbiteFooter.Copyright href="#" by="Blago™" year={2024} />
        </div>
      </FlowbiteFooter>
    </div>
  );
}

export default CustomFooter;
