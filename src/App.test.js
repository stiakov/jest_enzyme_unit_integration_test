import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App, { Todo, TodoForm, useTodos } from "./App";

configure({ adapter: new Adapter() });

describe("App", () => {
  describe('Todo', () => {
    it('Should execute completeTodo() when I click on Complete', () => {
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      const index = 5;
      const todo = {
        isCompleted: true,
        text: 'hola!'
      };

      const wrapper = shallow(<Todo
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        index={index}
        todo={todo}
      />);

      wrapper.find('button').at(0).simulate('click');
      expect(completeTodo.mock.calls).toEqual([[5]]);
      expect(removeTodo.mock.calls).toEqual([]);
    });

    it('Should execute removeTodo() when I click on X', () => {
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      const index = 5;
      const todo = {
        isCompleted: true,
        text: 'hola!'
      };

      const wrapper = shallow(<Todo
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        index={index}
        todo={todo}
      />);

      wrapper.find('button').at(1).simulate('click');
      expect(removeTodo.mock.calls).toEqual([[5]]);
      expect(completeTodo.mock.calls).toEqual([]);
    });
  });

  describe('TodoForm', () => {

    it('should call addTodo when the form has a value', () => {
      const addTodo = jest.fn();
      const prevent = jest.fn();
      const wrapper = shallow(<TodoForm addTodo={addTodo} />);

      wrapper
        .find('input')
        .simulate('change', { target: { value: 'My new Todo' } });
      wrapper
        .find('form')
        .simulate('submit', { preventDefault: prevent });

      expect(addTodo.mock.calls).toEqual([['My new Todo']]);
      expect(prevent.mock.calls).toEqual([[]]);
    });
  });

  describe('Custom hook, useTodos', () => {
    it('addTodo', () => {
      const TestComponent = (props) => {
        const hook = props.hook();
        return <div {...hook}></div>
      }

      const wrapper = shallow(<TestComponent hook={useTodos} />);
      let props = wrapper.find('div').props();
      props.addTodo('texto de prueba');
      props = wrapper.find('div').props();
      expect(props.todos[0]).toEqual({ text: 'texto de prueba' });
    });

    it('completeTodo', () => {
      const TestComponent = (props) => {
        const hook = props.hook();
        return <div {...hook}></div>
      }

      const wrapper = shallow(<TestComponent hook={useTodos} />);
      let props = wrapper.find('div').props();
      props.completeTodo(0);
      props = wrapper.find('div').props();
      expect(props.todos[0]).toEqual({ text: 'Todo 1', isCompleted: true });
    });

    it('removeTodo', () => {
      const TestComponent = (props) => {
        const hook = props.hook();
        return <div {...hook}></div>
      }

      const wrapper = shallow(<TestComponent hook={useTodos} />);
      let props = wrapper.find('div').props();
      props.removeTodo(0);
      props = wrapper.find('div').props();
      expect(props.todos.length).toEqual(2);
    });
  });

  it('App', () => {
    const wrapper = mount(<App />);
    const prevent = jest.fn();
    wrapper
      .find('input')
      .simulate('change', { target: { value: 'mi todo!' } });

    wrapper
      .find('form')
      .simulate('submit', { preventDefault: prevent });

    const res = wrapper
      .find('.todo')
      .at(0)
      .text()
      .includes('mi todo!');

    expect(res).toEqual(true);
    expect(prevent.mock.calls).toEqual([[]]);
  });

});
