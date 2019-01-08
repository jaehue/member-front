import React, { Component } from "react";
import { List, Checkbox, Flex } from "antd-mobile";

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class Member extends Component {
  render = _ => {
    const data = [
      { value: 0, label: "John" },
      { value: 1, label: "David" },
      { value: 2, label: "College diploma" }
    ];
    return (
      <div>
        <List renderHeader={() => "2019.01.16"}>
          {data.map(i => (
            <CheckboxItem key={i.value} onChange={() => this.onChange(i.value)}>
              {i.label}
            </CheckboxItem>
          ))}
          <CheckboxItem
            key="disabled"
            data-seed="logId"
            disabled
            defaultChecked
            multipleLine
          >
            Undergraduate<List.Item.Brief>Auxiliary text</List.Item.Brief>
          </CheckboxItem>
        </List>

        <Flex>
          <Flex.Item>
            <AgreeItem
              data-seed="logId"
              onChange={e => console.log("checkbox", e)}
            >
              Agree{" "}
              <a
                onClick={e => {
                  e.preventDefault();
                  alert("agree it");
                }}
              >
                agreement
              </a>
            </AgreeItem>
          </Flex.Item>
        </Flex>
      </div>
    );
  };
}

export default Member;
